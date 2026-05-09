import { Router } from "express";
import userRoute from "../module/user/routes";
import nutritionRoutes from "./nutrition.routes";

const router = Router();

router.use(userRoute);
router.use("/nutrition", nutritionRoutes);

export default router;
