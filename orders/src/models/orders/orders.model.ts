import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from '@eventexchange/common';
import { Order } from './orders.mongo';
import { Ticket } from './ticket.mongo';
import { OrderBody } from '../../routes/orders/orders.controller';
import { natsWrapper } from '../../services/nats-wrapper';
import { OrderCreatedPublisher } from '../../events/publishers/order-created.publisher';
import { OrderCancelledPublisher } from '../../events/publishers/order-cancelled.publisher';

const EXPIRTATION_WINDOW_SECONDS = 15 * 60;

export async function getAllOrders(userId: string) {
  const orders = await Order.find({ userId }).populate('ticket');
  return orders;
}

export async function getOrder(orderId: string, userId: string) {
  const order = await Order.findById(orderId).populate('ticket');
  if (!order) throw new NotFoundError();
  if (order.userId !== userId)
    throw new UnauthorizedError('Not authorized to view this order');
  return order;
}

export async function createOrder(ticketId: string, currentUserId: string) {
  // Find the ticket the user is trying to order
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new NotFoundError();

  // Make sure that this ticket is not already reserved
  // Look at all orders, find an order where the ticket is the ticket
  // we just found and the order's status is not cancelled
  // Make sure that this ticket is not already reserved by checking if there is an order
  // with the ticket id that is not cancelled
  const isReserved = await ticket.isReserved();
  if (isReserved) throw new BadRequestError('The ticket is already reserved');

  // Calculate an expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRTATION_WINDOW_SECONDS);

  // Build an order and save it to the database
  const order = Order.build({
    userId: currentUserId,
    status: OrderStatus.Created,
    expiresAt: expiration.toISOString(),
    ticket: ticket,
  });
  await order.save();
  // Publish an event that an order was created
  new OrderCreatedPublisher(natsWrapper.jsClient, natsWrapper.jsmManager).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  })
  return order;
}

export async function cancelOrder(orderId: string, userId: string) {
  const order = await getOrder(orderId, userId);
  order.status = OrderStatus.Cancelled;
  await order.save();
    // Publish an event that an order was cancelled
    new OrderCancelledPublisher(natsWrapper.jsClient, natsWrapper.jsmManager).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    })
  return order;
}
