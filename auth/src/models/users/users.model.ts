import { BadRequestError, ServerError, UnauthorizedError } from '@eventexchange/common';
import { sendResetEmail } from '../../services/nodemailer';
import { Password } from '../../services/password';
import { IrefreshTokensStoreItem, User } from './users.mongo';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// TODO store refresh tokens in a redis database
let refreshTokensStore = [] as IrefreshTokensStoreItem[];

function generateAccessToken(id: string) {
  const accessTokenSecret = process.env.ACCESS_TOKEN;
  if (!accessTokenSecret) {
    throw new Error('Missing ACCESS_TOKEN environment variables.');
  }
  const accessToken = jwt.sign({ id }, accessTokenSecret, {
    expiresIn: '15m',
  });
  return accessToken;
}

function generateRefreshToken(userId: string, sessionStart?: number) {
  const sessionIssuedAt = sessionStart || Math.floor(Date.now() / 1000); // Current time in seconds
  const token = crypto.randomBytes(64).toString('hex');
  // Persist refresh tokens with associated sessionStart
  const refreshToken = {
    userId,
    token,
    sessionStart: sessionIssuedAt,
    expiresAt: sessionIssuedAt + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!, 10),
  };
  refreshTokensStore.push(refreshToken);
  return refreshToken;
}

export async function signUp(email: string, password: string, confirmPassword: string) {
  if (password !== confirmPassword) throw new BadRequestError("Passwords don't match");

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError('Email already in use');

  const newUser = User.build({ email, password });
  await newUser.save();

  const userAccessToken = generateAccessToken(JSON.stringify(newUser._id));
  const userRefreshToken = generateRefreshToken(JSON.stringify(newUser._id));

  return { newUser, userAccessToken, userRefreshToken };
}

export async function signIn(email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (!existingUser || !(await Password.compare(password, existingUser.password))) {
    throw new UnauthorizedError('Invalid credentials');
  }
  const userAccessToken = generateAccessToken(existingUser.id);
  const userRefreshToken = generateRefreshToken(existingUser.id);

  return { existingUser, userAccessToken, userRefreshToken };
}

export async function signOut(refreshToken: IrefreshTokensStoreItem) {
  // Remove refresh token from store
  const index = refreshTokensStore.indexOf(refreshToken);
  refreshTokensStore.splice(index, 1);
  return;
}

export async function forgotPassword(email: string) {
  // Find user by email
  const user = await User.findOne({ email });
  if (user) {
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    try {
      // Send the unhashed resetToken via email
      return await sendResetEmail(email, resetToken);
    } catch (error) {
      throw new ServerError('Error sending email');
    }
  }
  return;
}

export async function resetPassword(token: string, newPassword: string) {
  // Hash the incoming token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find the user by hashed token and expiration time
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError('Invalid or expired token');

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
}

export async function refreshToken(userRefreshToken: IrefreshTokensStoreItem) {
  if (!userRefreshToken) throw new UnauthorizedError('Refresh Token missing');

  // Check if token exists in store
  const tokenData = refreshTokensStore.find((t) => t.userId === userRefreshToken.userId);
  if (!tokenData) throw new UnauthorizedError('Refresh token not found');

  // Calculate session duration
  const currentTime = Math.floor(Date.now() / 1000);
  const sessionDuration = currentTime - tokenData.sessionStart;

  if (currentTime > tokenData.expiresAt) {
    // Session has expired; require re-authentication
    // Remove the expired refresh token from the store
    const oldRefreshToken = refreshTokensStore.indexOf(userRefreshToken);
    refreshTokensStore.splice(oldRefreshToken, 1);
    throw new UnauthorizedError('Session has expired. Please log in again.');
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(tokenData.userId);
  const newRefreshToken = generateRefreshToken(tokenData.userId, tokenData.sessionStart);

  // Remove old refresh token
  const oldRefreshToken = refreshTokensStore.indexOf(userRefreshToken);
  refreshTokensStore.splice(oldRefreshToken, 1);

  return { newAccessToken, newRefreshToken };
}
