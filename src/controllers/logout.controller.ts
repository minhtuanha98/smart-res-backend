import { Request, Response } from "express";
import { redisClient } from "../utils/redisClient";

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    await redisClient.del(refreshToken);
  }

  res.status(200);
};
