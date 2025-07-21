import { PrismaClient } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import logger from "../utils/logger";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR } = STATUS_CODE;
const { DATABASE_ERROR } = MESSAGES.AUTH;

const findByUsername = async (username: string) => {
  try {
    return await prisma.user.findFirst({ where: { username } });
  } catch (error) {
    logger.error(
      `[DATABASE ERROR] Failed to find user by username: ${username}`,
      error
    );
    throw new AppError(DATABASE_ERROR, INTERNAL_SERVER_ERROR, "010");
  }
};
export default {
  findByUsername,
};
