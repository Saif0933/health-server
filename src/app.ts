import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './module/auth/route/auth.routes';
import foodScanRoutes from './module/gym/foodScan/route/foodScan.route';
import gymGoalRoutes from './module/gym/gymGole/route/gymGoal.route';
import beauticareRoutes from './module/beauticare/route/beauticare.route';


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
app.use('/api/gym', gymGoalRoutes);
app.use('/api/scan', foodScanRoutes);
app.use('/api/beauticare', beauticareRoutes);







// Basic route to check if server is running
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running successfully!' });
});

app.use(errorMiddleware);

export default app;
