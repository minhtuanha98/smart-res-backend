import { Request, Response } from "express";
import userService from "../services/user.service";

/**
 * Logs in a user with the provided credentials.
 *
 * @param req - Express request object containing user credentials in the body.
 * @param res - Express response object used to send the response.
 *
 * Sets an HTTP-only cookie with the authentication token.
 * The cookie's expiration depends on the 'rememberMe' flag in the request body.
 * Responds with user information (excluding sensitive data) upon successful login.
 */
export const loginController = async (req: Request, res: Response) => {
  const { deviceId, ip, userAgent } = req.clientMeta!;
  const user = await userService.loginUSer(req.body, {
    deviceId,
    userAgent,
    ip,
  });

  // Set access_token to cookie
  res.cookie("access_token", user.accessToken, {
    httpOnly: true,
    // secure: true,
    maxAge: req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
  });

  // Set refresh_token to cookie
  res.cookie("refresh_token", user.refreshToken, {
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
    maxAge: req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
  });
  // Respond with user information
  res.status(200).json({
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};
