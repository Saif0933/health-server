import { Router } from "express";
import {
  chatWithNutritionist,
  generateFullPlan,
  generatePlanQuestions,
  getAllNutritionLogs,
  getAllPlans,
  getCurrentPlan,
  getDashboardData,
  scanFoodController,
} from "../controllers/nutrition.controller";
import { isAuthenticated } from "../module/user/auth.middleware";

const router = Router();

// Apply auth middleware to all routes in this router
router.use(isAuthenticated);

router.post("/scan-food", scanFoodController);
router.post("/chat", chatWithNutritionist);
router.post("/plan/questions", generatePlanQuestions);
router.post("/plan/generate", generateFullPlan);
router.get("/plan/current", getCurrentPlan);
router.get("/logs", getAllNutritionLogs);
router.get("/plans", getAllPlans);
router.get("/dashboard", getDashboardData);

export default router;
