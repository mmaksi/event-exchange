import express from 'express';
import {
  httpSignup,
  httpSignin,
  httpGetCurrentUser,
  httpSignOut,
  httpForgotPassword,
  httpResetPassword,
  httpRefreshToken,
} from './users.controller';
import { currentUser, requireAuth, validateRequest } from '@eventexchange/common';
import {
  signinValidator,
  signupValidator,
} from '../../middlewares/request-validator.middleware';

const usersRouter = express.Router();

usersRouter.get('/current-user', currentUser, requireAuth, httpGetCurrentUser);
usersRouter.post('/signup', signupValidator, validateRequest, httpSignup);
usersRouter.post('/signin', signinValidator, validateRequest, httpSignin);
usersRouter.post('/signout', httpSignOut);
usersRouter.post('/forgot-password', httpForgotPassword);
usersRouter.post('/reset-password/:token', httpResetPassword);
usersRouter.post('/refresh-token', httpRefreshToken);

export default usersRouter;
