import express from 'express';
import {
  httpGetAllOrders,
  httpGetOrder,
  httpCreateOrder,
  httpCancelOrder,
} from './orders.controller';
import { requireAuth, validateRequest } from '@eventexchange/common';
import { createOrderValidator } from '../../middlewares/request-validator';
const ordersRouter = express.Router();

ordersRouter.get('/', requireAuth, httpGetAllOrders);
ordersRouter.get('/:id', requireAuth, httpGetOrder);
ordersRouter.delete('/:id', requireAuth, httpCancelOrder);
ordersRouter.post(
  '/',
  requireAuth,
  createOrderValidator,
  validateRequest,
  httpCreateOrder
);

export default ordersRouter;
