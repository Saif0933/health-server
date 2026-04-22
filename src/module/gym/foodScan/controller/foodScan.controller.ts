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

// 1. Create and Analyze a Food Scan
export const createScan = asyncHandler(async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { imageUrl } = req.body;

  if (!imageUrl) {
    throw new AppError(400, "Image URL is required for scanning.");
  }

  // Step 1: Analyze image (Check if it's food + Get nutrition)
  const analysisResult = await foodScanService.analyzeFoodImage(imageUrl);

  // Step 2: Save the information
  const result = await foodScanService.createProductScan(userId, analysisResult);
  
  return res
    .status(201)
    .json(new ApiResponse(201, result, "Scan completed: Food identified and nutrients extracted."));
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

  await foodScanService.getScanById(id);
  await foodScanService.deleteProductScan(id);
  
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Scan record deleted successfully"));
});
