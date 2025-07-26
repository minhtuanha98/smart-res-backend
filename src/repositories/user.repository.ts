import { PrismaClient } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import logger from "../utils/logger";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR } = STATUS_CODE;
const { DATABASE_ERROR } = MESSAGES.AUTH;

/**
 * Finds a user by their username.
 * @param username - The username to search for.
 * @returns The user object if found, otherwise null.
 * @throws AppError if a database error occurs.
 */
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

/**
 * Retrieves a paginated list of users.
 * @param query - An object containing page and limit for pagination.
 * @returns An object with the users data and total user count.
 * @throws AppError if a database error occurs.
 */
const getAllUsers = async (query: { page: number; limit: number }) => {
  const { page, limit } = query;
  try {
    const where: any = {};

    const options: any = {
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        apartNumber: true,
        phone: true,
        createdAt: true,
      },
    };

    if (page && limit) {
      options.skip = (Number(page) - 1) * Number(limit);
      options.take = Number(limit);
    }

    const totalUsers = await prisma.user.count();
    const users = await prisma.user.findMany(options);

    return { data: users, totalUsers };
  } catch (error) {
    logger.error("[DATABASE ERROR] Failed to get all users", error);
    throw new AppError(
      MESSAGES.USER.USER_LIST_FAIL,
      INTERNAL_SERVER_ERROR,
      "010"
    );
  }
};
export default {
  findByUsername,
  getAllUsers,
};
