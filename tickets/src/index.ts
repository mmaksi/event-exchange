import { app } from './app';
import { mongoConnect } from './services/mongo';

const start = async () => {
  if (!process.env.ACCESS_TOKEN) throw new Error('ACCESS_TOKEN must be defined');
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL must be defined');
  if (!process.env.ACCESS_TOKEN_EXPIRES_IN)
    throw new Error('ACCESS_TOKEN_EXPIRES_IN must be defined');
  await mongoConnect();
  app.listen(3000, () => console.log(`Auth running on port 3000 :)`));
};

start();