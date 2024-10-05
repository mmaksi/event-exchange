import { Publisher, Subjects, TicketCreatedMessage } from '@eventexchange/common';

export class TicketUpdatedPublisher extends Publisher<TicketCreatedMessage> {
  readonly subject = Subjects.TicketCreated;
  stream = 'tickets';
}
