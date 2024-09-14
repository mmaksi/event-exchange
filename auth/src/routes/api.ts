import express from 'express';
import usersRouter from './users/users.router';

const api = express.Router();

api.use('/users', usersRouter);

export default api;
