import { prisma } from "../../../config/prisma";
import { AppError } from "../../../utils/AppError";

/**
 * Log or update skincare metrics for a user on a specific date
 */
export const logSkincareMetrics = async (userId: string, data: { hydration: number; phLevel: number; oiliness: number; date?: string }) => {
  const date = data.date ? new Date(data.date) : new Date();
  // Set time to midnight for consistency if needed, but the model has a unique constraint on [userId, date]
  // Usually, date should be normalized to YYYY-MM-DD
  date.setHours(0, 0, 0, 0);

  return await prisma.skincareMetric.upsert({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
    update: {
      hydration: data.hydration,
      phLevel: data.phLevel,
      oiliness: data.oiliness,
    },
    create: {
      userId,
      date,
      hydration: data.hydration,
      phLevel: data.phLevel,
      oiliness: data.oiliness,
    },
  });
};

/**
 * Get skincare metrics for a user
 */
export const getSkincareMetrics = async (userId: string, limit: number = 7) => {
  return await prisma.skincareMetric.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
};

/**
 * Log routine completion
 */
export const logRoutine = async (userId: string, data: { stepsCompleted: number; totalSteps: number; date?: string }) => {
  const date = data.date ? new Date(data.date) : new Date();
  const complianceScore = data.totalSteps > 0 ? data.stepsCompleted / data.totalSteps : 0;

  return await prisma.routineLog.create({
    data: {
      userId,
      date,
      stepsCompleted: data.stepsCompleted,
      totalSteps: data.totalSteps,
      complianceScore,
    },
  });
};

/**
 * Get routine logs
 */
export const getRoutineLogs = async (userId: string, limit: number = 7) => {
  return await prisma.routineLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
};

/**
 * Save a product scan
 */
export const saveProductScan = async (userId: string, data: { productName: string; scanType: "PRODUCT" | "SKIN"; safetyScore: number; ingredients: any }) => {
  return await prisma.productScan.create({
    data: {
      userId,
      productName: data.productName,
      scanType: data.scanType,
      safetyScore: data.safetyScore,
      ingredients: data.ingredients,
    },
  });
};

/**
 * Get product scan history
 */
export const getProductScanHistory = async (userId: string, limit: number = 10) => {
  return await prisma.productScan.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
};
