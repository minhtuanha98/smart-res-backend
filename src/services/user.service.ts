import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError";
import { UserDeviceType, UserLoginType } from "../types/userType";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import { redisClient } from "../utils/redisClient";
import tokenService from "./token.service";
import userRepository from "../repositories/user.repository";

const { INVALID_PASSWORD, LOGIN_USER_FAIL, USER_LIST_FAIL } = MESSAGES.USER;
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

export default { loginUSer, getAllUsers };
