import { PrismaClient } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import logger from "../utils/logger";
import { Feedback, FeedbackInput, OnlyStatus } from "../types/feedBackType";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR } = STATUS_CODE;
const { DATABASE_ERROR } = MESSAGES.AUTH;

// Find a user by their userId
const findByUserId = async (userId: string) => {
  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to find user by userId: ${userId}`,
      error
    );
    throw new AppError(DATABASE_ERROR, INTERNAL_SERVER_ERROR, "010");
  }
};

// Find a feedback by its feedbackId
const findByFeedBackId = async (feedbackId: string) => {
  try {
    const data = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    return data as Feedback | null;
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to find user by userId: ${feedbackId}`,
      error
    );
    throw new AppError(DATABASE_ERROR, INTERNAL_SERVER_ERROR, "010");
  }
};

// Create a new feedback entry
const createFeedback = async (feedbackData: FeedbackInput) => {
  try {
    return await prisma.feedback.create({ data: feedbackData });
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to create feedback for userId: ${feedbackData.userId}`,
      error
    );
    throw new AppError(DATABASE_ERROR, INTERNAL_SERVER_ERROR, "010");
  }
};

// Update an existing feedback entry by its feedbackId
const updateFeedback = async (
  data: Partial<FeedbackInput> | OnlyStatus,
  feedbackId: string
) => {
  try {
    return await prisma.feedback.update({
      where: { id: feedbackId },
      data,
    });
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to update feedback for feedbackId: ${feedbackId}`,
      error
    );
    throw new AppError(DATABASE_ERROR, INTERNAL_SERVER_ERROR, "010");
  }
};

// Retrieve feedbacks with optional filtering by userId and status, and support for pagination
const getFeedbacks = async (query: any) => {
  try {
    const { userId, status, page, limit } = query;
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const options: any = {
      where,
      orderBy: { createdAt: "desc" },
      include: { user: false },
    };

    // Apply pagination if page and limit are provided
    if (page && limit) {
      options.skip = (Number(page) - 1) * Number(limit);
      options.take = Number(limit);
    }

    // Get total count of feedbacks matching the filter
    const total = await prisma.feedback.count({ where });

    // Retrieve feedbacks based on the options
    const result = await prisma.feedback.findMany(options);

    // Filter out feedbacks with null userId
    const filteredResult = result.filter((fb) => fb.userId !== null);

    return { data: filteredResult, total };
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to create feedback for userId: ${query.userId}`,
      error
    );
    throw new AppError(DATABASE_ERROR, INTERNAL_SERVER_ERROR, "010");
  }
};

// Delete a feedback entry by its feedbackId
const deleteFeedback = async (feedbackId: string) => {
  if (!feedbackId) {
    logger.error(
      "[DATABASE ERROR] FeedbackId is required but was undefined or null"
    );
    throw new AppError("FeedbackId is required", INTERNAL_SERVER_ERROR, "011");
  }

  try {
    await prisma.feedback.delete({
      where: { id: feedbackId },
    });
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to delete feedback by feedbackId: ${feedbackId}`,
      error
    );
    throw new AppError(DATABASE_ERROR, INTERNAL_SERVER_ERROR, "010");
  }
};
export default {
  findByUserId,
  findByFeedBackId,
  createFeedback,
  updateFeedback,
  getFeedbacks,
  deleteFeedback,
};
