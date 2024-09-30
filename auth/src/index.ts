import { app } from './app';
import { mongoConnect } from './services/mongo';

const start = async () => {
  if (!process.env.ACCESS_TOKEN) throw new Error('ACCESS_TOKEN must be defined');
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL must be defined');
  if (!process.env.EMAIL_USER) throw new Error('EMAIL_USER must be defined');
  if (!process.env.EMAIL_PASS) throw new Error('EMAIL_PASS must be defined');
  if (!process.env.ACCESS_TOKEN_EXPIRES_IN)
    throw new Error('ACCESS_TOKEN_EXPIRES_IN must be defined');
  // if (!process.env.REFRESH_TOKEN_EXPIRES_IN)
  //   throw new Error('REFRESH_TOKEN_EXPIRES_IN must be defined');
  await mongoConnect();
  app.listen(3000, () => console.log('Auth service running on port 3000'));
};

start();
