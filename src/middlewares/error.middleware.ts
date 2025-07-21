import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const status = err instanceof AppError ? err.status : "error";
  const message = err.message || "Internal Server Error";

  logger.error(
    `${req.method} ${req.originalUrl} - ${status} - ${message} - ${err.stack}`
  );

  res.status(statusCode).json({
    status_code: status,
    message,
  });
};
