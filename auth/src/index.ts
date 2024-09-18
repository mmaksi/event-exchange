import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import api from './routes/api';
import { errorHandler } from './middlewares/error-handler.middleware';
import { mongoConnect } from './services/mongo';
import { applySecurityMiddlewares } from './middlewares/security.middleware';
import cookieSession from 'cookie-session';

dotenv.config();
const app = express();

// Important middlewares
app.set('trust proxy', 1);
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
applySecurityMiddlewares(app);
app.use(express.json());

// Router mounting
app.use('/api', api);

// Error handling
app.use(errorHandler);

const start = async () => {
  if (!process.env.ACCESS_TOKEN) throw new Error('ACCESS_TOKEN must be defined');
  // if (!process.env.REFRESH_TOKEN) throw new Error('REFRESH_TOKEN must be defined');
  if (!process.env.EMAIL_USER) throw new Error('EMAIL_USER must be defined');
  if (!process.env.EMAIL_PASS) throw new Error('EMAIL_PASS must be defined');
  if (!process.env.ACCESS_TOKEN_EXPIRES_IN)
    throw new Error('ACCESS_TOKEN_EXPIRES_IN must be defined');
  // if (!process.env.REFRESH_TOKEN_EXPIRES_IN)
  //   throw new Error('REFRESH_TOKEN_EXPIRES_IN must be defined');
  await mongoConnect();
  app.listen(3000, () => console.log(`Auth running on port 3000 :)`));
};

start();
