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
    message: "Feedback created successfully",
    feedback,
  });
};
