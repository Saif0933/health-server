import { Router } from "express";
import * as gymGoalController from "../controller/gymGoal.controller";
import { authMiddleware } from "../../../../middlewares/auth.middleware";

const router = Router();

// All gym goal routes are public for now

// Goal Routes
router.post("/goal", gymGoalController.setGoal);
router.get("/goal", gymGoalController.getGoal);

// Nutrition/Meal Routes
router.post("/meal", gymGoalController.addMeal);
router.get("/nutrition", gymGoalController.getDailyNutrition);

// Water Log Routes
router.post("/water", gymGoalController.addWater);
router.get("/water", gymGoalController.getWaterIntake);

// Cumulative Stats
router.get("/stats", gymGoalController.getUserStats);

export default router;
