import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../../../utils/AppError";

/**
 * Validator for logging skincare metrics
 */
export const validateMetrics = (req: Request, res: Response, next: NextFunction) => {
  const { hydration, phLevel, oiliness, date } = req.body;

  if (hydration === undefined || phLevel === undefined || oiliness === undefined) {
    return next(new AppError(400, "Hydration, pH level, and oiliness are required."));
  }

  const metrics = { hydration, phLevel, oiliness };

  for (const [key, value] of Object.entries(metrics)) {
    if (typeof value !== "number" && isNaN(parseFloat(value as string))) {
      return next(new AppError(400, `${key} must be a valid number.`));
    }
    const numValue = typeof value === "number" ? value : parseFloat(value as string);
    if (numValue < 0) {
      return next(new AppError(400, `${key} must be a positive number or zero.`));
    }
  }

  if (date) {
    const parsedDate = Date.parse(date as string);
    if (isNaN(parsedDate)) {
      return next(new AppError(400, "Invalid date format. Use YYYY-MM-DD."));
    }
  }

  next();
};

/**
 * Validator for logging a routine
 */
export const validateRoutine = (req: Request, res: Response, next: NextFunction) => {
  const { stepsCompleted, totalSteps, date } = req.body;

  if (stepsCompleted === undefined || totalSteps === undefined) {
    return next(new AppError(400, "Steps completed and total steps are required."));
  }

  const steps = { stepsCompleted, totalSteps };

  for (const [key, value] of Object.entries(steps)) {
    if (typeof value !== "number" && isNaN(parseInt(value as string, 10))) {
      return next(new AppError(400, `${key} must be a valid number.`));
    }
    const numValue = typeof value === "number" ? value : parseInt(value as string, 10);
    if (numValue < 0) {
      return next(new AppError(400, `${key} must be a positive number or zero.`));
    }
  }

  if (parseInt(stepsCompleted as string, 10) > parseInt(totalSteps as string, 10)) {
    return next(new AppError(400, "Steps completed cannot be greater than total steps."));
  }

  if (date) {
    const parsedDate = Date.parse(date as string);
    if (isNaN(parsedDate)) {
      return next(new AppError(400, "Invalid date format. Use YYYY-MM-DD."));
    }
  }

  next();
};

/**
 * Validator for saving a product scan
 */
export const validateProductScan = (req: Request, res: Response, next: NextFunction) => {
  const { productName, scanType, safetyScore, ingredients } = req.body;

  if (!productName || typeof productName !== "string" || productName.trim().length === 0) {
    return next(new AppError(400, "Valid product name is required."));
  }

  if (!scanType || typeof scanType !== "string") {
    return next(new AppError(400, "Scan type is required."));
  }

  const normalizedScanType = scanType.toUpperCase();
  const validScanTypes = ["PRODUCT", "SKIN", "SKINCARE"];
  if (!validScanTypes.includes(normalizedScanType)) {
    return next(new AppError(400, `Invalid scan type. Expected one of: ${validScanTypes.join(", ")}.`));
  }

  if (safetyScore === undefined || safetyScore === null) {
    return next(new AppError(400, "Safety score is required."));
  }

  const numSafetyScore = typeof safetyScore === "number" ? safetyScore : parseInt(safetyScore as string, 10);
  if (isNaN(numSafetyScore) || numSafetyScore < 0 || numSafetyScore > 100) {
    return next(new AppError(400, "Safety score must be a number between 0 and 100."));
  }

  if (!ingredients) {
    return next(new AppError(400, "Ingredients are required."));
  }

  next();
};

/**
 * Validator for updating skin profile
 */
export const validateSkinProfile = (req: Request, res: Response, next: NextFunction) => {
  const { skinType, skinConcerns } = req.body;

  if (skinConcerns !== undefined) {
    if (!Array.isArray(skinConcerns)) {
      return next(new AppError(400, "Skin concerns must be an array of strings."));
    }
  }

  next();
};

/**
 * Validator for adding a chat message
 */
export const validateChatMessage = (req: Request, res: Response, next: NextFunction) => {
  const { roomId, sender, content } = req.body;

  if (!roomId || typeof roomId !== "string" || roomId.trim().length === 0) {
    return next(new AppError(400, "Valid room ID is required."));
  }

  if (!sender || typeof sender !== "string") {
    return next(new AppError(400, "Sender is required."));
  }

  const normalizedSender = sender.toUpperCase();
  if (!["USER", "AI"].includes(normalizedSender)) {
    return next(new AppError(400, "Invalid sender type. Expected 'USER' or 'AI'."));
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return next(new AppError(400, "Valid message content is required."));
  }

  next();
};
