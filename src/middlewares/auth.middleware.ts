// middleware/authMiddleware.js
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/JwtDecodedType";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../constants/messages";
import logger from "../utils/logger";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

const { INVALID } = MESSAGES.SESSION_TOKEN;
const { FORBIDDEN, UNAUTHORIZED } = MESSAGES.AUTH;

export const protect = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    console.log("🚀 ~ return ~ token:", token);
    console.log("SECRET verify:", SECRET);
    if (!token) return res.status(401).json({ message: UNAUTHORIZED });

    try {
      const decoded = jwt.verify(token, SECRET) as JwtPayload;

      console.log("Decoded JWT:", decoded);

      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "role" in decoded &&
        "userId" in decoded
      ) {
        const payload = decoded as JwtPayload;

        if (payload.role !== role) {
          return res.status(403).json({ message: FORBIDDEN });
        }

        req.user = decoded as { userId: string; role?: string };
        next();
      } else {
        return res.status(401).json({ message: INVALID });
      }
    } catch (err) {
      logger.error("JWT verification failed:", err);
      return res.status(401).json({ message: INVALID });
    }
  };
};
