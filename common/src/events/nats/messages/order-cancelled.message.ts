import { Subjects } from '../subjects';

export interface OrderCancelledMessage {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
        id: string;
    }
  };
}
