import { NotFoundError, UnauthorizedError } from '@eventexchange/common';
import { Ticket } from './tickets.mongo';
import { TicketBody } from '../../routes/tickets/tickets.controller';

export async function getAllTickets() {
  const tickets = await Ticket.find({});
  return tickets;
}

export async function getTicket(id: string) {
  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError();
  return ticket;
}

export async function createTicket(title: string, price: number, currentUserId: string) {
  const ticket = Ticket.build({ title, price, userId: currentUserId });
  await ticket.save();
  return ticket;
}

export async function updateTicket(
  ticketId: string,
  ticketCreator: string,
  payload: TicketBody
) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new NotFoundError();
  const ticketOwner = ticket.userId;
  if (ticketOwner !== ticketCreator)
    throw new UnauthorizedError('Not authorized to update this ticket');
  ticket.set(payload);
  await ticket.save();
  return ticket;
}
