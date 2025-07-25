import { Request, Response } from "express";
import feedBackService from "../services/feedback.service";

export const feedbackController = async (req: Request, res: Response) => {
  const { title, content, apartNumber } = req.body;
  const userId = req.user?.userId;

  const image = req.file?.filename;
  console.log("🚀 ~ feedbackController ~ image:", image);

  await feedBackService.createFeedback({
    title,
    apartNumber,
    content,
    imageUrl: image ? `/uploads/${image}` : null,
    userId: userId!,
  });

  res.status(201).json({
    message: "Feedback created successfully",
  });
};

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

export const updateFeedBackController = async (req: Request, res: Response) => {
  const { feedbackId } = req.params;
  const { title, content, status } = req.body;
  const image = req.file?.filename;
  const { userId, role } = req.user || {};
  console.log("🚀 ~ updateFeedBackController ~ imageUrl:", image);

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
    message: "Feedback updated successfully",
    feedback: updatedFeedback,
  });
};
