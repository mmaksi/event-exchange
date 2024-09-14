import { Request, Response } from 'express';
import { signIn, signUp } from '../../models/users/users.model';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../../errors/request-validation-error';

export async function httpSignup(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password } = req.body;
  const user = await signUp(email, password);
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
