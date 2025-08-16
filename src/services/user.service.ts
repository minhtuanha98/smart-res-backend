import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError";
import {
  PERMISSION,
  ROLE,
  UserDeviceType,
  UserLoginType,
  UserType,
} from "../types/userType";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import { redisClient } from "../utils/redisClient";
import tokenService from "./token.service";
import userRepository from "../repositories/user.repository";
import logger from "../utils/logger";

const { INVALID_PASSWORD, LOGIN_USER_FAIL, USER_LIST_FAIL, CREATE_USER } =
  MESSAGES.USER;
const { INTERNAL_SERVER_ERROR } = MESSAGES.AUTH;
const { UNAUTHORIZED } = STATUS_CODE;

/**
 * Logs in a user.
 * @param data - The user's login information.
 * @returns The user's information and authentication token.
 * @throws AppError if the username or password is invalid, or if a system error occurs.
 */
const loginUSer = async (data: UserLoginType, userDevice: UserDeviceType) => {
  const { username, password } = data;
  const { deviceId, userAgent, ip } = userDevice;

  try {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, STATUS_CODE.NOT_FOUND, "001");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(INVALID_PASSWORD, UNAUTHORIZED, "002");
    }

    const accessToken = tokenService.generateVerifyToken(
      user.id.toString(),
      "1h",
      user.role.toString()
    );
    const refreshToken = tokenService.generateRefreshToken(
      user.id.toString(),
      "1d",
      user.role.toString()
    );

    //save refresh token to redis
    await redisClient.set(
      refreshToken,
      JSON.stringify({
        id: user.id,
        deviceId: deviceId || "",
        userAgent: userAgent || "",
        ip: ip || "",
      }),
      {
        EX: 7 * 24 * 60 * 60, // 7 days;
      }
    );

    return {
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(LOGIN_USER_FAIL, 500, "003");
  }
};

/**
 * Retrieves a paginated list of all users.
 * @param query - Pagination parameters (page and limit).
 * @returns A list of users based on the provided pagination.
 * @throws AppError if retrieving the user list fails.
 */
const getAllUsers = async (query: { page: number; limit: number }) => {
  try {
    return await userRepository.getAllUsers(query);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(USER_LIST_FAIL, 500, "003");
  }
};

const registerUser = async (data: UserType) => {
  const { email, username, apartNumber, password } = data;

  if (!email || !username || !apartNumber) {
    throw new AppError(
      "empty email, username or apartNumber",
      STATUS_CODE.BAD_REQUEST,
      "004"
    );
  }

  const existingUser =
    await userRepository.findUserByEmailOrUsernameOrApartNumber(
      email,
      username,
      apartNumber
    );

  if (existingUser) {
    const duplicatedFields: string[] = [];
    if (existingUser.email === email) duplicatedFields.push("email");
    if (existingUser.username === username) duplicatedFields.push("username");
    if (existingUser.apartNumber === apartNumber)
      duplicatedFields.push("apartNumber");

    throw new AppError(
      `${duplicatedFields.join(", ")}is existed`,
      STATUS_CODE.BAD_REQUEST,
      "005"
    );
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Trim input fields before saving to repository
    const trimmedData = {
      ...data,
      email: data.email.trim(),
      username: data.username.trim(),
      apartNumber: data.apartNumber.trim(),
      password: hashedPassword,
      isVerified: false,
      role: ROLE.USER,
      permissions: PERMISSION.NONE,
      isActive: false,
    };

    const newUser = await userRepository.createUser(trimmedData);

    if (!newUser) {
      throw new AppError(CREATE_USER, 500, "111");
    }
    const token = tokenService.generateVerifyToken(newUser.id.toString(), "1d");
    console.log("🚀 ~ registerUser ~ token:", token);

    return newUser;
  } catch (error) {
    logger.error(`ERROR SERVER`, {
      error,
    });
    throw new AppError(INTERNAL_SERVER_ERROR, 500, "004");
  }
};

export default { loginUSer, getAllUsers, registerUser };
