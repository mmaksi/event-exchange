// src/types/express-session.d.ts
import { Session } from 'cookie-session';

declare module 'express-serve-static-core' {
  interface Request {
    session: Session & { accessToke?: string; refreshToken?: string };
  }
}
