import { Request, Response } from "express";
import feedBackService from "../services/feedback.service";
import { MESSAGES } from "../constants/messages";

const { FEEDBACK_CREATED, FEEDBACK_UPDATED, FEEDBACK_DELETED } =
  MESSAGES.FEEDBACK;

/**
 * Handles the creation of user feedback.
 *
 * @param req - Express request object containing feedback data in the body and optionally a file upload.
 * @param res - Express response object used to send the response.
 *
 * @remarks
 * This controller expects the following fields in the request body:
 * - `title`: The title of the feedback.
 * - `content`: The content of the feedback.
 * - `apartNumber`: The apartment number related to the feedback.
 *
 * If an image file is uploaded, its filename is used to construct the `imageUrl`.
 * The user ID is extracted from the authenticated user (`req.user`).
 *
 * On success, responds with HTTP 201 and a success message.
 *
 * @nodejs
 */
export const feedbackController = async (req: Request, res: Response) => {
  const { title, content, apartNumber } = req.body;
  const userId = req.user?.userId;

  const image = req.file?.filename;

  await feedBackService.createFeedback({
    title,
    apartNumber,
    content,
    imageUrl: image ? `/uploads/${image}` : null,
    userId: userId!,
  });

  res.status(201).json({
    message: FEEDBACK_CREATED,
  });
};

/**
 * Handles the retrieval of feedback entries with optional pagination and filtering by status.
 *
 * @param req - Express request object, expects `page`, `limit`, and `status` as query parameters.
 *              Also expects `user` object with `userId` and `role` properties.
 * @param res - Express response object used to return the feedback data.
 *
 * @remarks
 * - If `page` or `limit` are not provided, defaults to page 1 and limit 10.
 * - If `status` is not provided, retrieves feedbacks without status filtering.
 * - The controller delegates feedback retrieval to `feedBackService.getFeedbacks`.
 *
 * @returns Responds with a JSON object containing:
 * - `feedBacks`: Array of feedback entries.
 * - `total`: Total number of feedback entries matching the criteria.
 * - `page`: Current page number.
 * - `limit`: Number of entries per page.
 */
export const getFeedbacksController = async (req: Request, res: Response) => {
  const { page, limit, status } = req.query;

  const { userId, role } = req.user || {};

  const feedbacksResult = await feedBackService.getFeedbacks({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    status: typeof status === "string" ? status : "",
    userId: userId ?? "",
    role: role ?? "",
  });

  res.json({
    feedBacks: feedbacksResult.data,
    total: feedbacksResult.total,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });
};

/**
 * Updates an existing feedback entry based on the provided feedback ID and request body.
 *
 * @param req - Express request object containing feedbackId in params, updated feedback data in body, and optionally a file and user info.
 * @param res - Express response object used to send the update result.
 *
 * @remarks
 * - Requires `feedbackId` as a route parameter.
 * - Accepts `title`, `content`, and `status` in the request body.
 * - Optionally processes an uploaded image file and attaches its URL.
 * - Uses authenticated user information (`userId`, `role`) from `req.user`.
 * - Responds with a success message and the updated feedback object.
 *
 * @returns Sends a JSON response with a message and the updated feedback.
 */
export const updateFeedBackController = async (req: Request, res: Response) => {
  const { feedbackId } = req.params;
  const { title, content, status } = req.body;
  const image = req.file?.filename;
  const { userId, role } = req.user || {};

  const updatedFeedback = await feedBackService.updateFeedback({
    feedbackId,
    title,
    content,
    imageUrl: image ? `/uploads/${image}` : null,
    status,
    userId: userId ?? "",
    role: role ?? "",
  });

  res.status(200).json({
    message: FEEDBACK_UPDATED,
    feedback: updatedFeedback,
  });
};

/**
 * Handles the deletion of a feedback entry.
 *
 * This controller extracts the `feedbackId` from the request parameters and the `userId` and `role` from the authenticated user.
 * It then calls the feedback service to delete the specified feedback, and responds with a success message upon completion.
 *
 * @param req - Express request object, expected to contain `params.feedbackId` and `user` with `userId` and `role`.
 * @param res - Express response object used to send the result of the deletion operation.
 *
 * @returns A JSON response with a success message upon successful deletion.
 */
export const deleteFeedbackController = async (req: Request, res: Response) => {
  const { feedbackId } = req.params;
  const { userId, role } = req.user || {};

  await feedBackService.deleteFeedback({
    feedbackId,
    userId: userId ?? "",
    role: role ?? "",
  });

  res.status(200).json({
    message: FEEDBACK_DELETED,
  });
};
