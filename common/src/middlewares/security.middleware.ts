import { Application, Response, Request, NextFunction } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../errors/too-many-requests-error';
import morgan from 'morgan';

// Define rate limiting rules
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  handler: (req: Request, res: Response, next: NextFunction) => {
    throw new TooManyRequestsError();
  },
});

export const applySecurityMiddlewares = (app: Application): void => {
  // Apply Helmet to enhance security by setting various HTTP headers
  app.use(helmet());

  // Apply HPP to prevent HTTP parameter pollution
  app.use(hpp());

  // Apply rate limiting to prevent abuse
  app.use(rateLimiter);

  // Monitor requests with logs
  app.use(morgan('combined'));
};
