import { Request, Response } from "express";
import { redisClient } from "../utils/redisClient";
import logger from "../utils/logger";
import { MESSAGES } from "../constants/messages";
const { LOGOUT_SUCCESS } = MESSAGES.USER;
/**
 * Handles user logout by clearing authentication cookies and invalidating tokens.
 *
 * This controller performs the following actions:
 * - Clears the `access_token` and `refresh_token` cookies from the client.
 * - Deletes the refresh token from Redis to prevent reuse.
 * - Blacklists the access token in Redis for 1 hour to prevent further use.
 * - Returns a success message upon successful logout.
 *
 * @param req - Express request object, expected to contain cookies with tokens.
 * @param res - Express response object used to clear cookies and send the response.
 * @returns A JSON response indicating logout success.
 *
 * @async
 */
export const logoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  const accessToken = req.cookies.access_token;

  // Clear cookies with same options as when they were set
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  try {
    if (refreshToken) {
      await redisClient.del(refreshToken);
    }

    // Blacklist access token
    if (accessToken) {
      await redisClient.set(`blacklist:${accessToken}`, "true", {
        EX: 60 * 60,
      });
    }

    res.status(200).json({ message: LOGOUT_SUCCESS });
  } catch (error) {
    logger.error("Error during logout:", error);
  }
};
