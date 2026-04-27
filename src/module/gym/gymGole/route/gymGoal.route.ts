import { Router } from "express";
import * as gymGoalController from "../controller/gymGoal.controller";
import { authMiddleware } from "../../../../middlewares/auth.middleware";
import * as gymGoalValidator from "../validator/gymGoal.validator";

const router = Router();

// All gym goal routes are public for now

// Goal Routes
router.post(
  "/goal",
  gymGoalValidator.validateSetGoal,
  gymGoalController.setGoal
);
router.get("/goal", gymGoalController.getGoal);

// Nutrition/Meal Routes
router.post(
  "/meal",
  gymGoalValidator.validateAddMeal,
  gymGoalController.addMeal
);
router.get(
  "/nutrition",
  gymGoalValidator.validateDateQuery,
  gymGoalController.getDailyNutrition
);

// Water Log Routes
router.post(
  "/water",
  gymGoalValidator.validateAddWater,
  gymGoalController.addWater
);
router.get(
  "/water",
  gymGoalValidator.validateDateQuery,
  gymGoalController.getWaterIntake
);

// Cumulative Stats
router.get("/stats", gymGoalController.getUserStats);

export default router;

