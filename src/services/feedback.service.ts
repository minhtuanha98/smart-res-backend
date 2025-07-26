import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import feedbackRepository from "../repositories/feedback.repository";
import {
  FeedbackInput,
  FeedbackQuery,
  OnlyStatus,
} from "../types/feedBackType";
import logger from "../utils/logger";

const { USERID_NOT_FOUND } = MESSAGES.USER;
const { FORBIDDEN: PERMISSION } = MESSAGES.AUTH;
const { CREATE_FEEDBACK_FAIL, FEEDBACK_NOT_FOUND, STATUS_PERMISSION } =
  MESSAGES.FEEDBACK;
const { NOT_FOUND, FORBIDDEN } = STATUS_CODE;

/**
 * Creates a new feedback entry for a user.
 * @param data - FeedbackInput object containing userId, title, apartNumber, content, and imageUrl.
 * @returns The created feedback object.
 * @throws AppError if the user is not found or feedback creation fails.
 */
const createFeedback = async (data: FeedbackInput) => {
  try {
    const { userId, title, apartNumber, content, imageUrl } = data;

    const user = await feedbackRepository.findByUserId(userId);

    if (!user) {
      throw new AppError(USERID_NOT_FOUND, NOT_FOUND, "001");
    }
    const feedback = await feedbackRepository.createFeedback({
      userId,
      title,
      apartNumber,
      content,
      imageUrl,
    });

    return feedback;
  } catch (error) {
    logger.error(
      `[SERVICE ERROR] Failed to create feedback for userId: ${error}`
    );
    throw new AppError(CREATE_FEEDBACK_FAIL, 500, "003");
  }
};

/**
 * Retrieves feedback entries based on the provided query parameters.
 *
 * @param data - The query parameters for fetching feedbacks.
 * @param data.page - The page number for pagination.
 * @param data.limit - The number of feedbacks per page.
 * @param data.status - (Optional) The status to filter feedbacks by.
 * @param data.userId - (Optional) The user ID to filter feedbacks for a specific user.
 * @param data.role - The role of the user requesting feedbacks (e.g., "resident").
 * @returns A promise that resolves to the feedbacks result from the repository.
 * @throws {AppError} Throws an error if feedback retrieval fails.
 */
const getFeedbacks = async (data: FeedbackQuery) => {
  const { page, limit, status, userId, role } = data;

  try {
    let filter: any = {};
    if (role === "resident") {
      filter.userId = userId;
    }
    if (status) {
      filter.status = status;
    }
    const feedbacksResult = await feedbackRepository.getFeedbacks({
      ...filter,
      page,
      limit,
    });

    return feedbacksResult;
  } catch (error) {
    logger.error(
      `[SERVICE ERROR] Failed to get feedbacks for userId: ${userId}, role: ${role}, status: ${status}`,
      error
    );
    throw new AppError(CREATE_FEEDBACK_FAIL, 500, "003");
  }
};

/**
 * Updates a feedback entry based on user role and provided data.
 * - Residents can update title, content, and imageUrl (not status).
 * - Admins can update status only.
 * @param data - Object containing feedbackId, title, content, imageUrl, status, userId, and role.
 * @returns The updated feedback object.
 * @throws AppError if user or feedback is not found, or if permissions are violated.
 */
const updateFeedback = async (data: any) => {
  try {
    const { feedbackId, title, content, imageUrl, status, userId, role } = data;

    const user = await feedbackRepository.findByUserId(userId);

    if (!user) {
      throw new AppError(USERID_NOT_FOUND, NOT_FOUND, "002");
    }

    const feedBack = await feedbackRepository.findByFeedBackId(feedbackId);

    if (!feedBack) {
      throw new AppError(FEEDBACK_NOT_FOUND, NOT_FOUND, "002");
    }

    if (role === "resident") {
      if (feedBack.userId !== userId) {
        throw new AppError(PERMISSION, FORBIDDEN, "003");
      }
      if (status) {
        throw new AppError(STATUS_PERMISSION, FORBIDDEN, "003");
      }
      // Resident can only update title, content, imageUrl
      const dataToUpdate: Partial<FeedbackInput> = {};
      if (title) dataToUpdate.title = title;
      if (content) dataToUpdate.content = content;
      if (imageUrl) dataToUpdate.imageUrl = imageUrl;
      if (Object.keys(dataToUpdate).length === 0) return feedBack;
      const updatedFeedback = await feedbackRepository.updateFeedback(
        dataToUpdate,
        feedBack.id
      );
      return updatedFeedback;
    }

    // Admin can only update status
    if (role === "admin") {
      if (!status) return feedBack;
      if (!["pending", "resolved", "rejected"].includes(status)) {
        throw new AppError(FEEDBACK_NOT_FOUND, FORBIDDEN, "004");
      }
      const dataToUpdate: OnlyStatus = { status };
      const updatedFeedback = await feedbackRepository.updateFeedback(
        dataToUpdate,
        feedBack.id
      );
      return updatedFeedback;
    }
  } catch (error) {
    logger.error(
      `[SERVICE ERROR] Failed to create feedback for userId: ${error}`
    );
    throw new AppError(CREATE_FEEDBACK_FAIL, 500, "003");
  }
};

/**
 * Deletes a feedback entry based on user role and permissions.
 * - Residents can delete their own feedback only.
 * - Admins can delete any feedback.
 * @param data - Object containing feedbackId, userId, and role.
 * @throws AppError if user or feedback is not found, or if permissions are violated.
 */
const deleteFeedback = async (data: any) => {
  try {
    const { feedbackId, userId, role } = data;

    const user = await feedbackRepository.findByUserId(userId);

    if (!user) {
      throw new AppError(USERID_NOT_FOUND, NOT_FOUND, "002");
    }

    const feedBack = await feedbackRepository.findByFeedBackId(feedbackId);

    if (!feedBack) {
      throw new AppError(FEEDBACK_NOT_FOUND, NOT_FOUND, "002");
    }

    // Residents can only delete their own feedback; admins can delete any feedback.
    if (role === "resident") {
      if (feedBack.userId !== userId) {
        throw new AppError(PERMISSION, FORBIDDEN, "003");
      }
    } else if (role !== "admin") {
      throw new AppError(PERMISSION, FORBIDDEN, "003");
    }

    await feedbackRepository.deleteFeedback(feedbackId);
  } catch (error) {
    logger.error(
      `[SERVICE ERROR] Failed to delete feedback for userId: ${error}`
    );
    throw new AppError(CREATE_FEEDBACK_FAIL, 500, "003");
  }
};

export default {
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
};
