import { app } from './app';
import { mongoConnect } from './services/mongo';
import { natsWrapper } from './services/nats-wrapper';

const start = async () => {
  if (!process.env.ACCESS_TOKEN) throw new Error('ACCESS_TOKEN must be defined');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined');
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined');
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL must be defined');
  if (!process.env.ACCESS_TOKEN_EXPIRES_IN)
    throw new Error('ACCESS_TOKEN_EXPIRES_IN must be defined');
  await mongoConnect();

  await natsWrapper.connect(process.env.NATS_URL!, process.env.NATS_CLIENT_ID!);
  process.on('SIGINT', async () => {
    await natsWrapper.close();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await natsWrapper.close();
    process.exit(0);
  });

  app.listen(3000, () => console.log('Tickets service running on port 3000'));
};

start();
