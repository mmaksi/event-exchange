import {
  DURABLE_NAMES,
  Listener,
  STREAMS,
  Subjects,
  TicketCreatedMessage,
} from '@eventexchange/common';

export class TicketCreatedListener extends Listener<TicketCreatedMessage> {
  readonly subject = Subjects.TicketCreated;
  stream = STREAMS.tickets;
  durableName = DURABLE_NAMES.tickets_consumer;
  onMessage(data: TicketCreatedMessage['data']) {
    console.log(`Ticket received with id: ${data.id}!`);
  }
}
