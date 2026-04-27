import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../../../../utils/AppError";

/**
 * Validator for setting or updating a Gym Goal
 */
export const validateSetGoal = (req: Request, res: Response, next: NextFunction) => {
  const { calorieTarget, proteinTarget, carbsTarget, fatsTarget, waterTarget } = req.body;

  // Optional: All targets can be optional for partial updates, 
  // but if provided, they must be positive numbers.
  
  const targets = {
    calorieTarget,
    proteinTarget,
    carbsTarget,
    fatsTarget,
    waterTarget
  };

  for (const [key, value] of Object.entries(targets)) {
    if (value !== undefined) {
      if (typeof value !== 'number' || value < 0) {
        return next(new AppError(400, `${key} must be a positive number`));
      }
    }
  }

  next();
};

/**
 * Validator for adding a Meal
 */
export const validateAddMeal = (req: Request, res: Response, next: NextFunction) => {
  const { name, calories, protein, carbs, fats } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError(400, "Valid meal name is required"));
  }

  const nutrition = { calories, protein, carbs, fats };

  for (const [key, value] of Object.entries(nutrition)) {
    if (value === undefined || value === null) {
      return next(new AppError(400, `${key} is required`));
    }
    if (typeof value !== 'number' || value < 0) {
      return next(new AppError(400, `${key} must be a positive number`));
    }
  }

  next();
};

/**
 * Validator for logging Water Intake
 */
export const validateAddWater = (req: Request, res: Response, next: NextFunction) => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return next(new AppError(400, "Water amount is required"));
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return next(new AppError(400, "Water amount must be a number greater than 0"));
  }

  next();
};

/**
 * Validator for date queries (optional validation for GET requests)
 */
export const validateDateQuery = (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;

  if (date) {
    const parsedDate = Date.parse(date as string);
    if (isNaN(parsedDate)) {
      return next(new AppError(400, "Invalid date format. Use YYYY-MM-DD"));
    }
  }

  next();
};
