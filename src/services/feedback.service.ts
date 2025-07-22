import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import feedbackRepository from "../repositories/feedback.repository";
import { FeedbackInput } from "../types/feedBackType";
import logger from "../utils/logger";

const { USERID_NOT_FOUND } = MESSAGES.USER;
const { CREATE_FEEDBACK_FAIL } = MESSAGES.FEEDBACK;
const { NOT_FOUND } = STATUS_CODE;

const createFeedback = async (data: FeedbackInput) => {
  try {
    const { userId, title, content, imageUrl } = data;

    const user = await feedbackRepository.findByUserId(userId);

    if (!user) {
      throw new AppError(USERID_NOT_FOUND, NOT_FOUND, "001");
    }
    const feedback = await feedbackRepository.createFeedback({
      userId,
      title,
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

export default {
  createFeedback,
};
