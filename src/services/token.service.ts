// services/token.service.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/JwtDecodedType";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODE } from "../constants/statusCode";
import { redisClient } from "../utils/redisClient";
import logger from "../utils/logger";

const SECRET = process.env.JWT_SECRET || "default_secret_key";
const { INVALID } = MESSAGES.SESSION_TOKEN;
const { INTERNAL_SERVER_ERROR: SERVER_ERROR } = MESSAGES.AUTH;
const { UNAUTHORIZED, FORBIDDEN, INTERNAL_SERVER_ERROR } = STATUS_CODE;

const generateVerifyToken = (
  userId: string,
  expiresIn: SignOptions["expiresIn"],
  role?: string
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ userId, role }, SECRET, options);
};

const generateRefreshToken = (
  userId: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ userId }, SECRET, options);
};

const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};

const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};

const handleRefreshToken = async (
  refreshToken: string,
  deviceId: string,
  userAgent: string,
  ip: string
) => {
  try {
    // Validate refresh token
    validateRefreshToken(refreshToken);

    // Get and validate session from Redis
    const sessionData = await getSessionFromRedis(refreshToken);
    const session = parseSessionData(sessionData);

    // Verify token signature
    const decoded = verifyRefreshToken(refreshToken);

    // Validate client metadata for security
    validateClientMetadata(session, { deviceId, userAgent, ip });

    // Generate new refresh token and update session
    const newRefreshToken = await rotateRefreshToken(
      refreshToken,
      decoded.userId,
      { deviceId, userAgent, ip }
    );

    return newRefreshToken;
  } catch (error: any) {
    logger.error(`[REFRESH TOKEN ERROR] ${error?.message || "Unknown error"}`, {
      error,
    });

    // Re-throw AppError as is, wrap other errors
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(SERVER_ERROR, INTERNAL_SERVER_ERROR, "005");
  }
};

// Helper functions for better code organization
const validateRefreshToken = (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError(INVALID, UNAUTHORIZED, "002");
  }
};

const getSessionFromRedis = async (refreshToken: string): Promise<string> => {
  const sessionData = await redisClient.get(refreshToken);

  if (!sessionData) {
    logger.error(
      `[SECURITY WARNING] Refresh token reuse or expired: ${refreshToken.substring(
        0,
        10
      )}...`
    );
    throw new AppError(INVALID, FORBIDDEN, "003");
  }

  return sessionData;
};

const parseSessionData = (sessionData: string) => {
  try {
    return JSON.parse(sessionData) as {
      id: string;
      deviceId: string;
      userAgent: string;
      ip: string;
    };
  } catch (parseError: any) {
    logger.error(
      `[SESSION PARSE ERROR] Invalid session data format: ${parseError?.message}`
    );
    throw new AppError(INVALID, FORBIDDEN, "003");
  }
};

const validateClientMetadata = (
  session: { deviceId: string; userAgent: string; ip: string; id: string },
  client: { deviceId: string; userAgent: string; ip: string }
) => {
  const normalizeValue = (val: any) => val || "";

  const isValidClient =
    session.deviceId === normalizeValue(client.deviceId) &&
    session.userAgent === normalizeValue(client.userAgent) &&
    session.ip === normalizeValue(client.ip);

  if (!isValidClient) {
    logger.error(
      `[SECURITY WARNING] Token misuse detected for user ${session.id}`,
      {
        expected: {
          deviceId: session.deviceId,
          userAgent: session.userAgent,
          ip: session.ip,
        },
        received: {
          deviceId: normalizeValue(client.deviceId),
          userAgent: normalizeValue(client.userAgent),
          ip: normalizeValue(client.ip),
        },
      }
    );
    throw new AppError(INVALID, FORBIDDEN, "003");
  }
};

const rotateRefreshToken = async (
  oldToken: string,
  userId: string,
  clientMeta: { deviceId: string; userAgent: string; ip: string }
): Promise<string> => {
  const newRefreshToken = generateRefreshToken(userId, "7d");

  const newSession = {
    userId,
    ...clientMeta,
  };

  // Delete old token and set new one atomically
  await Promise.all([
    redisClient.del(oldToken),
    redisClient.set(newRefreshToken, JSON.stringify(newSession), {
      EX: 7 * 24 * 60 * 60, // 7 days
    }),
  ]);

  return newRefreshToken;
};

export default {
  generateVerifyToken,
  generateRefreshToken,
  verifyAccessToken,
  handleRefreshToken,
};
