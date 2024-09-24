import express from 'express';
import {
  httpCreateTicket,
  httpSignin,
  httpGetCurrentUser,
  httpSignOut,
  httpForgotPassword,
  httpResetPassword,
  httpRefreshToken,
} from './tickets.controller';
import { requireAuth } from '@eventexchange/common';

const ticketsRouter = express.Router();

ticketsRouter.post('/', requireAuth, httpCreateTicket);
// ticketsRouter.post('/', currentUser, requireAuth, httpGetCurrentUser);
// ticketsRouter.post('/signup', signupValidator, httpSignup);
// ticketsRouter.post('/signin', signinValidator, httpSignin);
// ticketsRouter.post('/forgot-password', httpForgotPassword);
// ticketsRouter.post('/reset-password/:token', httpResetPassword);
// ticketsRouter.post('/refresh-token', httpRefreshToken);

export default ticketsRouter;
