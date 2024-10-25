import { OrderCreatedMessage, Publisher, STREAMS, Subjects } from '@eventexchange/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedMessage> {
  readonly subject = Subjects.OrderCreated;
  stream = STREAMS.orders;
}
