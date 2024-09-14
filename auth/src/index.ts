import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import api from './routes/api';
import { errorHandler } from './middlewares/error-handler.middleware';

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('combined'));

app.use('/api', api);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth running on port ${PORT} :)`));
