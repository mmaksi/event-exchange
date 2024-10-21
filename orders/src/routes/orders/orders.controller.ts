import { Request, Response } from 'express';
import {
  getAllOrders,
  getOrder,
  createOrder,
  cancelOrder,
} from '../../models/orders/orders.model';
import { OrderStatus } from '@eventexchange/common';
import { TicketDoc } from '../../models/orders/ticket.mongo';

export interface OrderBody {
  ticketId: string;
}

export async function httpGetAllOrders(req: Request, res: Response) {
  const userId = req.currentUser!.id;
  const orders = await getAllOrders(userId);
  return res.status(200).json(orders);
}

export async function httpGetOrder(req: Request, res: Response) {
  const orderId = req.params.id;
  const order = await getOrder(orderId, req.currentUser!.id);
  return res.status(200).json(order);
}

export async function httpCreateOrder(req: Request, res: Response) {
  const { ticketId } = req.body as OrderBody;
  const currentUserId = req.currentUser!.id;
  const order = await createOrder(ticketId, currentUserId);
  return res.status(201).json(order);
}

export async function httpCancelOrder(req: Request, res: Response) {
  const { id: orderId } = req.params;
  const currentUserId = req.currentUser!.id;
  const order = await cancelOrder(orderId, currentUserId);
  return res.status(204).json(order);
}
