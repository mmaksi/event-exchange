import { Subjects } from '../subjects';

export interface TicketCreatedMessage {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    price: number;
    title: string;
    userId: string;
  };
}
