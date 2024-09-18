import { Request, Response } from 'express';
import {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  refreshToken,
  signOut,
} from '../../models/users/users.model';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../../errors/request-validation-error';

export async function httpSignup(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password, confirmPassword } = req.body;
  const {
    newUser: user,
    userAccessToken,
    userRefreshToken,
  } = await signUp(email, password, confirmPassword);
  req.session!.accessToken = userAccessToken;
  req.session!.refreshToken = userRefreshToken;
  return res.status(201).json(user);
}

export async function httpSignin(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password } = req.body;
  const { existingUser, userAccessToken, userRefreshToken } = await signIn(
    email,
    password
  );
  // Store user's JWT in the cookie
  req.session!.accessToken = userAccessToken;
  req.session!.refreshToken = userRefreshToken;
  return res.status(200).json(existingUser);
}

export async function httpGetCurrentUser(req: Request, res: Response) {
  return res.json({ currentUser: req.currentUser || null });
}

export async function httpSignOut(req: Request, res: Response) {
  const refreshToken = req.session!.refreshToken;
  await signOut(refreshToken);
  // Clear the session after removing refresh token from the DB
  req.session = null;
  return res.status(200).json({});
}

export async function httpForgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  await forgotPassword(email);
  return res
    .status(200)
    .json(
      'If your email exists in our database, you will get a reset password link on your inbox soon.'
    );
}

export async function httpResetPassword(req: Request, res: Response) {
  const { token } = req.params;
  const { newPassword } = req.body;

  await resetPassword(token, newPassword);

  return res.send('Password has been reset');
}

export async function httpRefreshToken(req: Request, res: Response) {
  const userRefreshToken = req.session!.refreshToken;
  const { newAccessToken, newRefreshToken } = await refreshToken(userRefreshToken);
  // Update tokens in cookies
  req.session!.accessToken = newAccessToken;
  req.session!.refreshToken = newRefreshToken;
  return res.status(200).json({ message: 'Tokens refreshed' });
}
