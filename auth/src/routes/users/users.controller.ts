import { Request, Response } from 'express';
import {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
} from '../../models/users/users.model';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../../errors/request-validation-error';

export async function httpSignup(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password, confirmPassword } = req.body;
  const user = await signUp(email, password, confirmPassword);
  return res.status(201).json(user);
}

export async function httpSignin(req: Request, res: Response) {
  res.status(200).json(await signIn());
}

export async function httpGetCurrentUser(req: Request, res: Response) {
  res.status(200).json({ message: 'hi there!' });
}

export async function httpSignOut(req: Request, res: Response) {
  res.status(200).json({ message: 'hi there!' });
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
