import { type Request, type Response } from "express";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { ApiResponse } from "../../../../utils/ApiResponse";
import * as foodScanService from "../service/foodScan.service";
import { AppError } from "../../../../utils/AppError";
import { prisma } from "../../../../config/prisma";

/**
 * Helper to get userId from various sources or fallback to first user in DB.
 */
const getUserId = async (req: any): Promise<string> => {
  let userId: string | undefined = (req.user?.id || req.body?.userId || req.query?.userId) as string | undefined;
  
  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }
  
  if (!userId) {
    throw new AppError(400, "User ID not provided and no users found in database.");
  }
  
  return userId;
};

// 1. Create a Product Scan
export const createScan = asyncHandler(async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { productName, scanType, safetyScore } = req.body;

  if (!productName || !scanType || safetyScore === undefined) {
    throw new AppError(400, "productName, scanType, and safetyScore are required.");
  }

  const result = await foodScanService.createProductScan(userId, {
    ...req.body,
    scanType: req.body.scanType.toUpperCase()
  });
  
  return res
    .status(201)
    .json(new ApiResponse(201, result, "Product scan saved successfully"));
});

// 2. Get User Scan History
export const getScanHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const history = await foodScanService.getUserScans(userId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, history, "Scan history fetched successfully"));
});

// 3. Get Specific Scan Details
export const getScanDetails = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) throw new AppError(400, "Scan ID is required.");

  const scan = await foodScanService.getScanById(id);
  if (!scan) throw new AppError(404, "Scan record not found.");
  
  return res
    .status(200)
    .json(new ApiResponse(200, scan, "Scan details fetched successfully"));
});

// 4. Delete a Scan Record
export const deleteScan = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) throw new AppError(400, "Scan ID is required.");

  await foodScanService.getScanById(id); // Check existence
  await foodScanService.deleteProductScan(id);
  
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Scan record deleted successfully"));
});
