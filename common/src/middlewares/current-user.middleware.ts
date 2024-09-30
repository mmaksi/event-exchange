import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  exp: number;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.accessToken) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.accessToken,
      process.env.ACCESS_TOKEN!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  next();
};
