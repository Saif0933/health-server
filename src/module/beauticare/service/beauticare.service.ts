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

/**
 * Update user's skin profile
 */
export const updateSkinProfile = async (userId: string, data: { skinType?: any; skinConcerns?: string[] }) => {
  // Check if user exists before upserting profile
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");

  return await prisma.profile.upsert({
    where: { userId },
    update: {
      skinType: data.skinType,
      skinConcerns: data.skinConcerns,
    },
    create: {
      userId,
      skinType: data.skinType,
      skinConcerns: data.skinConcerns,
    },
  });
};

/**
 * Get user's skin profile
 */
export const getSkinProfile = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { userId },
    select: {
      skinType: true,
      skinConcerns: true,
    },
  });
};

/**
 * Get BeautiCare achievements for a user
 */
export const getBeautiAchievements = async (userId: string) => {
  return await prisma.userAchievement.findMany({
    where: {
      userId,
      achievement: {
        category: "BEAUTICARE",
      },
    },
    include: {
      achievement: true,
    },
  });
};

/**
 * Get BeautiCare specific stats
 */
export const getBeautiStats = async (userId: string) => {
  const totalScans = await prisma.productScan.count({ where: { userId } });
  const totalRoutines = await prisma.routineLog.count({ where: { userId } });
  
  const latestMetric = await prisma.skincareMetric.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return {
    totalScans,
    totalRoutines,
    latestHydration: latestMetric?.hydration || 0,
    latestPH: latestMetric?.phLevel || 0,
    latestOiliness: latestMetric?.oiliness || 0,
  };
};

/**
 * Delete a skincare metric
 */
export const deleteMetric = async (id: string, userId: string) => {
  return await prisma.skincareMetric.delete({
    where: { id, userId },
  });
};

/**
 * Delete a routine log
 */
export const deleteRoutine = async (id: string, userId: string) => {
  return await prisma.routineLog.delete({
    where: { id, userId },
  });
};

/**
 * Delete a product scan
 */
export const deleteScan = async (id: string, userId: string) => {
  return await prisma.productScan.delete({
    where: { id, userId },
  });
};

/**
 * Get a specific skincare metric by ID
 */
export const getMetricById = async (id: string, userId: string) => {
  return await prisma.skincareMetric.findFirst({
    where: { id, userId },
  });
};

/**
 * Get a specific routine log by ID
 */
export const getRoutineById = async (id: string, userId: string) => {
  return await prisma.routineLog.findFirst({
    where: { id, userId },
  });
};

/**
 * Get a specific product scan by ID
 */
export const getScanById = async (id: string, userId: string) => {
  return await prisma.productScan.findFirst({
    where: { id, userId },
  });
};

/**
 * AI Chat Functions
 */

export const createChatRoom = async (userId: string, title?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");

  return await prisma.chatRoom.create({
    data: {
      userId,
      module: "BEAUTICARE",
      title: title || "Skincare Consultation",
    },
  });
};

export const getChatRooms = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");

  return await prisma.chatRoom.findMany({
    where: {
      userId,
      module: "BEAUTICARE",
    },
    orderBy: { createdAt: "desc" },
  });
};

export const addChatMessage = async (roomId: string, sender: "USER" | "AI", content: string) => {
  const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!room) throw new AppError(404, "Chat room not found");

  return await prisma.chatMessage.create({
    data: {
      roomId,
      sender,
      content,
    },
  });
};

export const getChatMessages = async (roomId: string) => {
  return await prisma.chatMessage.findMany({
    where: { roomId },
    orderBy: { timestamp: "asc" },
  });
};
