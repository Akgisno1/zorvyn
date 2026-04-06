import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic health check
app.get('/health', (req, res) => res.status(200).json({ 
    statusCode: 200, 
    message: 'Server is healthy', 
    data: null 
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
