import { Request, Response } from "express";
import { redisClient } from "../utils/redisClient";
import logger from "../utils/logger";

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  const refreshToken = req.cookies.refresh_token;
  const accessToken = req.cookies.access_token;

  try {
    if (refreshToken) {
      await redisClient.del(refreshToken);
    }

    // Blacklist access token
    if (accessToken) {
      await redisClient.set(`blacklist:${accessToken}`, "true", {
        EX: 60 * 60, // Expire sau 1 giờ (thời gian expire của access token)
      });
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Error during logout:", error);
  }
};
