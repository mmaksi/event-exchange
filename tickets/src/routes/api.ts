import express from 'express';
import ticketsRouter from './tickets/tickets.router';

const api = express.Router();

api.use('/tickets', ticketsRouter);

export default api;
