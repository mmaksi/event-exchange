import { Publisher, Subjects, TicketCreatedMessage } from '@eventexchange/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedMessage> {
  readonly subject = Subjects.TicketCreated;
  stream = 'tickets';
}
