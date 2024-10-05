import { Listener, Subjects, TicketCreatedMessage } from '@eventexchange/common';

export class TicketCreatedListener extends Listener<TicketCreatedMessage> {
  readonly subject = Subjects.TicketCreated;
  stream = 'tickets';
  durableName = 'tickets_consumer';
  onMessage(data: TicketCreatedMessage['data']) {
    console.log(`Ticket received with id: ${data.id}!`);
  }
}