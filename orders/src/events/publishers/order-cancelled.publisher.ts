import {
  OrderCancelledMessage,
  Publisher,
  STREAMS,
  Subjects,
} from '@eventexchange/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledMessage> {
  readonly subject = Subjects.OrderCancelled;
  stream = STREAMS.orders;
}
