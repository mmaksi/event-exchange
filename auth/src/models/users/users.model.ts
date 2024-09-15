import { BadRequestError } from '../../errors/bad-request-error';
import { ServerError } from '../../errors/server-error';
import { sendResetEmail } from '../../services/nodemailer';
import { Password } from '../../services/password';
import { User } from './users.mongo';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

interface AuthUser {
  id: string;
  email: string;
}

function generateAccessToken(user: AuthUser) {
  return jwt.sign(user, process.env.ACCESS_TOKEN!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN!,
  });
}

export async function signUp(email: string, password: string, confirmPassword: string) {
  if (password !== confirmPassword) throw new BadRequestError("Passwords don't match");
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError('Email already in use');
  const user = User.build({ email, password });
  await user.save();
  const userToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });
  return { user, userToken };
}

export async function signIn() {
  return;
}

export async function signOut() {
  return;
}

export async function forgotPassword(email: string) {
  // Find user by email
  const user = await User.findOne({ email });
  if (user) {
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await Password.toHash(resetToken);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    try {
      return await sendResetEmail(email, resetToken);
    } catch (error) {
      console.log(error);
      throw new ServerError('Error sending email');
    }
  }
  return;
}

export async function resetPassword(token: string, newPassword: string) {
  // Find the user by token
  const user = await User.findOne({
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError('Invalid or expired token');

  // Compare the token
  const isMatch = await Password.compare(token, user.resetPasswordToken!);
  if (!isMatch) throw new BadRequestError('Invalid or expired token');

  // Update password
  user.password = await Password.toHash(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
}
