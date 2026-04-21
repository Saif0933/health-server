import express, {type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './module/auth/route/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use('/api/auth', authRoutes);






// Basic route to check if server is running
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running successfully!' });
});

app.use(errorMiddleware);

export default app;
