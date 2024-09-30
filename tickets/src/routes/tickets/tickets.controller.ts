import { Request, Response } from 'express';
import {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicket,
} from '../../models/tickets/tickets.model';

export interface TicketBody {
  title: string;
  price: number;
}

export async function httpGetAllTickets(req: Request, res: Response) {
  const tickets = await getAllTickets();
  return res.status(200).json(tickets);
}

export async function httpGetTicket(req: Request, res: Response) {
  const id = req.params.id;
  const ticket = await getTicket(id);
  return res.status(200).json(ticket);
}

export async function httpCreateTicket(req: Request, res: Response) {
  const { title, price } = req.body as TicketBody;
  const currentUserId = req.currentUser!.id;
  const ticket = await createTicket(title, price, currentUserId);
  return res.status(201).json(ticket);
}

export async function httpUpdateTicket(req: Request, res: Response) {
  const { id: ticketId } = req.params;
  const payload = req.body as TicketBody;
  const ticketCreator = req.currentUser!.id;

  const ticket = await updateTicket(ticketId, ticketCreator, payload);
  return res.status(200).json(ticket);
}
