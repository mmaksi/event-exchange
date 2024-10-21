import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import api from './routes/api';
import cookieSession from 'cookie-session';
import {
  applySecurityMiddlewares,
  currentUser,
  errorHandler,
} from '@eventexchange/common';

dotenv.config();
export const app = express();

// Important middlewares
app.set('trust proxy', 1);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
applySecurityMiddlewares(app);

// Router mounting
app.use('/api', api);

// Error handling
app.use(errorHandler);
