import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import crypto from 'crypto';

declare global {
  var signin: () => string[];
}

let mongo: MongoMemoryServer;

jest.mock('../services/nats-wrapper');

beforeAll(async () => {
  process.env.ACCESS_TOKEN = 'somerandomstring';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoUri, {});
  }
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload.  { id }
  const userId = new mongoose.Types.ObjectId().toHexString();
  const payload = { id: userId };
  const sessionIssuedAt = Math.floor(Date.now() / 1000); // Current time in seconds
  const token = crypto.randomBytes(64).toString('hex');
  // Persist refresh tokens with associated sessionStart
  const refreshToken = {
    userId,
    token,
    sessionStart: sessionIssuedAt,
    expiresAt: sessionIssuedAt + parseInt('30d', 10),
  };
  // Create the JWT!
  const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN!);
  // Build session Object. { jwt: MY_JWT }
  const session = { accessToken };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
