import { Subjects } from '../subjects';

export interface TicketUpdatedMessage {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    price: number;
    title: string;
    userId: string;
  };
}
