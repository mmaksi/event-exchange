import express from 'express';
import ordersRouter from './orders/orders.router';

const api = express.Router();

api.use('/orders', ordersRouter);

export default api;
