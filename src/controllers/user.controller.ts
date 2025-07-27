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
    sameSite: "lax",
    path: "/",
    maxAge: 1 * 60 * 1000, // 1 minutes
  });

  // Set refresh_token to cookie
  res.cookie("refresh_token", user.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
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

/**
 * Handles the request to retrieve a paginated list of users.
 *
 * @param req - Express request object, expects optional `page` and `limit` query parameters for pagination.
 * @param res - Express response object used to send the JSON response.
 * @returns A JSON response containing the list of users, total user count, current page, and limit per page.
 *
 * @example
 * // GET /users?page=2&limit=20
 * // Response:
 * // {
 * //   users: [...],
 * //   total: 100,
 * //   page: 2,
 * //   limit: 20
 * // }
 */
export const getAllUserController = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const usersResult = await userService.getAllUsers({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  res.json({
    users: usersResult.data,
    total: usersResult.totalUsers,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });
};
