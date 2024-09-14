import { BadRequestError } from '../../errors/bad-request-error';
import { User } from './users.mongo';

export async function signUp(email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError('Email already in use');
  const user = User.build({ email, password });
  await user.save();
  return user;
}

export async function signIn() {
  return;
}

export async function signOut() {
  return;
}
