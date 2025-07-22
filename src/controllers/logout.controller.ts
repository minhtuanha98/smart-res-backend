import { Request, Response } from "express";
import { redisClient } from "../utils/redisClient";

export const logoutController = async (req: Request, res: Response) => {
  try {
    // Xoá cookie trên client
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    // Xoá refresh token trong Redis nếu có
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      await redisClient.del(refreshToken);
    }

    res.status(200).json({ message: "Logout thành công" });
  } catch (error) {
    res.status(500).json({ message: "Logout thất bại" });
  }
};
