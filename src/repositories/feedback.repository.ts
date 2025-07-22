import { PrismaClient } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import logger from "../utils/logger";
import { FeedbackInput } from "../types/feedBackType";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR } = STATUS_CODE;
const { DATABASE_ERROR } = MESSAGES.AUTH;

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

export default {
  findByUserId,
  createFeedback,
};
