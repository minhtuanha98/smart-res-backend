import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      clientMeta?: {
        deviceId: string;
        ip: string;
        userAgent: string;
      };
    }
  }
}

export const extractClientMeta = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.clientMeta = {
    deviceId: (req.headers["x-device-id"] as string) || "",
    ip: req.ip || req.connection.remoteAddress || "",
    userAgent: req.headers["user-agent"] || "",
  };
  next();
};
