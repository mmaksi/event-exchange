import express from 'express';
import {
  httpSignup,
  httpSignin,
  httpGetCurrentUser,
  httpSignOut,
} from './users.controller';
import { signupValidator } from '../../middlewares/validator.middleware';

const usersRouter = express.Router();

usersRouter.post('/signup', signupValidator, httpSignup);
usersRouter.post('/signin', httpSignin);
usersRouter.get('/currentUser', httpGetCurrentUser);
usersRouter.get('/signout', httpSignOut);

export default usersRouter;
