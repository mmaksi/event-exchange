import express from 'express';
import {
  httpGetAllTickets,
  httpGetTicket,
  httpCreateTicket,
  httpUpdateTicket,
} from './tickets.controller';
import { requireAuth, validateRequest } from '@eventexchange/common';
import {
  createTicketValidator,
  updateTicketValidator,
} from '../../middlewares/request-validator';
const ticketsRouter = express.Router();

ticketsRouter.get('/', httpGetAllTickets);
ticketsRouter.get('/:id', httpGetTicket);
ticketsRouter.post(
  '/',
  requireAuth,
  createTicketValidator,
  validateRequest,
  httpCreateTicket
);
ticketsRouter.put(
  '/:id',
  requireAuth,
  updateTicketValidator,
  validateRequest,
  httpUpdateTicket
);

export default ticketsRouter;
