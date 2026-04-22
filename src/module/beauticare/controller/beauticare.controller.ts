import { type Request, type Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse } from "../../../utils/ApiResponse";
import { AppError } from "../../../utils/AppError";
import { prisma } from "../../../config/prisma";
import * as beauticareService from "../service/beauticare.service";

/**
 * 1. Log or Update Skincare Metrics (Hydration, pH, Oiliness)
 */
export const logMetrics = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database.");

  // Verify user exists to avoid foreign key constraint violation
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found with the provided ID.");


  const { hydration, phLevel, oiliness, date } = req.body;

  if (hydration === undefined || phLevel === undefined || oiliness === undefined) {
    throw new AppError(400, "Hydration, pH level, and oiliness are required.");
  }

  const metric = await beauticareService.logSkincareMetrics(userId, {
    hydration: parseFloat(hydration),
    phLevel: parseFloat(phLevel),
    oiliness: parseFloat(oiliness),
    date,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, metric, "Skincare metrics logged successfully"));
});

/**
 * 2. Get User's Skincare Metrics History
 */
export const getMetricsHistory = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database.");

  // Verify user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found.");


  const limit = req.query.limit ? parseInt(req.query.limit as string) : 7;
  const history = await beauticareService.getSkincareMetrics(userId, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, history, "Skincare metrics history fetched successfully"));
});

/**
 * 3. Log Skincare Routine Completion
 */
export const logRoutine = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database.");

  // Verify user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found.");


  const { stepsCompleted, totalSteps, date } = req.body;

  if (stepsCompleted === undefined || totalSteps === undefined) {
    throw new AppError(400, "Steps completed and total steps are required.");
  }

  const log = await beauticareService.logRoutine(userId, {
    stepsCompleted: parseInt(stepsCompleted),
    totalSteps: parseInt(totalSteps),
    date,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, log, "Routine log saved successfully"));
});

/**
 * 4. Get User's Routine History
 */
export const getRoutineHistory = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database.");

  // Verify user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found.");


  const limit = req.query.limit ? parseInt(req.query.limit as string) : 7;
  const history = await beauticareService.getRoutineLogs(userId, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, history, "Routine history fetched successfully"));
});

/**
 * 5. Save a Product Scan
 */
export const saveProductScan = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database.");

  // Verify user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found.");


  const { productName, scanType, safetyScore, ingredients } = req.body;

  if (!productName || !scanType || safetyScore === undefined || !ingredients) {
    throw new AppError(400, "Product name, scan type, safety score, and ingredients are required.");
  }

  // Validate and normalize scanType
  let normalizedScanType = scanType.toUpperCase();
  
  // Map common variations
  if (normalizedScanType === "SKINCARE") normalizedScanType = "SKIN";

  const validScanTypes = ["PRODUCT", "SKIN"];
  
  if (!validScanTypes.includes(normalizedScanType)) {
    throw new AppError(400, `Invalid scan type. Expected one of: ${validScanTypes.join(", ")} or SKINCARE`);
  }

  const scan = await beauticareService.saveProductScan(userId, {
    productName,
    scanType: normalizedScanType as "PRODUCT" | "SKIN",
    safetyScore: parseInt(safetyScore),
    ingredients,
  });



  return res
    .status(201)
    .json(new ApiResponse(201, scan, "Product scan saved successfully"));
});

/**
 * 6. Get Product Scan History
 */
export const getScanHistory = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database.");

  // Verify user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found.");


  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const history = await beauticareService.getProductScanHistory(userId, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, history, "Product scan history fetched successfully"));
});
