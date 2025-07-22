import { Request, Response } from "express";
import feedBackService from "../services/feedback.service";

export const feedbackController = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user?.userId;

  const image = req.file?.filename;

  const feedback = await feedBackService.createFeedback({
    title,
    content,
    imageUrl: image ? `/uploads/${image}` : null,
    userId: userId!,
  });

  res.status(201).json({
    feedback,
  });
};

export const getFeedbacksController = async (req: Request, res: Response) => {
  const { page, limit, status } = req.query;
  const { userId, role } = req.user || {};

  const feedbacksResult = await feedBackService.getFeedbacks({
    page: Number(page),
    limit: Number(limit),
    status: typeof status === "string" ? status : "",
    userId: userId ?? "",
    role: role ?? "",
  });

  res.json({
    data: feedbacksResult.data,
    total: feedbacksResult.total,
    page: Number(page),
    limit: Number(limit),
  });
};
