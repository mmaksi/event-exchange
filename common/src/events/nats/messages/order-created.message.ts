import { OrderStatus } from '../../types/order-status';
import { Subjects } from '../subjects';

export interface OrderCreatedMessage {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
        id: string;
        price: string
    }
  };
}
