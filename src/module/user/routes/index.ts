import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const userRoute = Router();

userRoute.use(authRoutes);
userRoute.use(userRoutes);

export default userRoute;