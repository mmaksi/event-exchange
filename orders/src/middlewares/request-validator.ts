import { body } from 'express-validator';

export const createOrderValidator = [
  body('ticketId').not().isEmpty().withMessage('Ticket ID is required'),
];
