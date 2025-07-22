//handle type commons
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: string;
      };
    }
  }
}
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
