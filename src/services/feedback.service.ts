import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import feedbackRepository from "../repositories/feedback.repository";
import {
  Feedback,
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

const getFeedbacks = async (data: FeedbackQuery) => {
  const { page, limit, status, userId, role } = data;
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
};

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
      // Resident chỉ được update title, content, imageUrl
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

    // Admin chỉ được update status
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
