// middleware/authMiddleware.js
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/JwtDecodedType";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../constants/messages";
import logger from "../utils/logger";
import { redisClient } from "../utils/redisClient";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

const { INVALID, TOKEN_INVALID } = MESSAGES.SESSION_TOKEN;
const { FORBIDDEN, UNAUTHORIZED } = MESSAGES.AUTH;

export const protect = (roles: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.access_token;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.substring(7); // Bỏ "Bearer "
    }

    if (!token) return res.status(401).json({ message: UNAUTHORIZED });

    try {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({ message: TOKEN_INVALID });
      }

      const decoded = jwt.verify(token, SECRET) as JwtPayload;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "role" in decoded &&
        "userId" in decoded
      ) {
        const payload = decoded as JwtPayload;

        if (!payload.role || !allowedRoles.includes(payload.role)) {
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
