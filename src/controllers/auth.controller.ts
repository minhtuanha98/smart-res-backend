import { Request, Response } from "express";
import { MESSAGES } from "../constants/messages";
import tokenService from "../services/token.service";

/**
 * Handles the refresh token process for user authentication.
 *
 * This handler extracts the device metadata and refresh token from the request,
 * validates and processes the refresh token using the token service, and issues
 * a new refresh token as an HTTP-only cookie. If the refresh token is invalid or
 * an error occurs, it responds with a forbidden status and an appropriate message.
 *
 * @param req - Express request object, expected to contain `clientMeta` and `refresh_token` cookie.
 * @param res - Express response object, used to set the new refresh token cookie and send responses.
 * @returns A JSON response containing the new refresh token on success, or a forbidden error message on failure.
 */
export const refreshTokenController = async (req: Request, res: Response) => {
  const { deviceId, userAgent, ip } = req.clientMeta!;
  const refreshToken = req.cookies.refresh_token;

  const { newAccessToken, newRefreshToken } =
    await tokenService.handleRefreshToken(
      refreshToken,
      deviceId,
      userAgent,
      ip
    );

  // Set access_token cookie
  res.cookie("access_token", newAccessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  // Set new refresh_token cookie
  res.cookie("refresh_token", newRefreshToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: MESSAGES.SESSION_TOKEN.TOKEN_SUCCESS,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};
