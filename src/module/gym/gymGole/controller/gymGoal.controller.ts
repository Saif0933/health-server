import { type Response } from "express";
import { prisma } from "../../../../config/prisma";
import { ApiResponse } from "../../../../utils/ApiResponse";
import { AppError } from "../../../../utils/AppError";
import { asyncHandler } from "../../../../utils/asyncHandler";
import * as gymGoalService from "../service/gymGoal.service";

// 1. Set or Update Gym Goal
export const setGoal = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;
  
  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database to use as default.");

  const goal = await gymGoalService.upsertGymGoal(userId, req.body);
  
  return res
    .status(200)
    .json(new ApiResponse(200, goal, "Gym goal updated successfully"));
});

// 2. Get Current Gym Goal
export const getGoal = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database to use as default.");

  const goal = await gymGoalService.getGymGoal(userId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, goal, "Gym goal fetched successfully"));
});

// 3. Add a Meal
export const addMeal = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database to use as default.");

  const { name, calories } = req.body;
  if (!name || !calories) {
    throw new AppError(400, "Name and calories are required");
  }

  const result = await gymGoalService.addMeal(userId, req.body);
  
  return res
    .status(201)
    .json(new ApiResponse(201, result, "Meal added successfully"));
});

// 4. Get Daily Nutrition Log
export const getDailyNutrition = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database to use as default.");

  const { date } = req.query;
  const log = await gymGoalService.getDailyLog(userId, date as string);
  
  return res
    .status(200)
    .json(new ApiResponse(200, log, "Daily nutrition log fetched successfully"));
});

// 5. Log Water Intake
export const addWater = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database to use as default.");

  const { amount } = req.body;
  if (!amount) {
    throw new AppError(400, "Water amount is required");
  }

  const result = await gymGoalService.logWater(userId, amount);
  
  return res
    .status(201)
    .json(new ApiResponse(201, result, "Water intake logged successfully"));
});

// 6. Get Daily Water Intake
export const getWaterIntake = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database to use as default.");

  const { date } = req.query;
  const result = await gymGoalService.getDailyWater(userId, date as string);
  
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Water intake fetched successfully"));
});

// 7. Get User Cumulative Stats (for Profile)
export const getUserStats = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found in database.");

  // For now, let's just count total meals and total scans
  const totalMeals = await prisma.meal.count({
    where: { log: { userId } }
  });

  const totalScans = await prisma.productScan.count({
    where: { userId }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { totalMeals, totalScans }, "User stats fetched successfully"));
});
