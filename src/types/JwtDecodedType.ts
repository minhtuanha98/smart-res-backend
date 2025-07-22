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
  role?: string;
  iat?: number;
  exp?: number;
}
