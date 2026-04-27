import { type Response } from "express";
import { prisma } from "../../../config/prisma";
import { ApiResponse } from "../../../utils/ApiResponse";
import { AppError } from "../../../utils/AppError";
import { asyncHandler } from "../../../utils/asyncHandler";
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

/**
 * 7. Update Skin Profile
 */
export const updateSkinProfile = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found.");

  // Verify user exists to avoid foreign key constraint violation
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found with the provided ID.");

  const { skinType, skinConcerns } = req.body;

  const profile = await beauticareService.updateSkinProfile(userId, {
    skinType,
    skinConcerns,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Skin profile updated successfully"));
});

/**
 * 8. Get Skin Profile
 */
export const getSkinProfile = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.params?.userId || req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found.");

  const profile = await beauticareService.getSkinProfile(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Skin profile fetched successfully"));
});

/**
 * 9. Get BeautiCare Achievements
 */
export const getAchievements = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.params?.userId || req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found.");

  const achievements = await beauticareService.getBeautiAchievements(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, achievements, "BeautiCare achievements fetched successfully"));
});

/**
 * 10. Get BeautiCare Stats
 */
export const getStats = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.params?.userId || req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found.");

  const stats = await beauticareService.getBeautiStats(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "BeautiCare stats fetched successfully"));
});

/**
 * 11. Delete Skincare Metric
 */
export const deleteMetric = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId || !id) throw new AppError(400, "User ID and Metric ID are required.");

  await beauticareService.deleteMetric(id, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Skincare metric deleted successfully"));
});

/**
 * 12. Delete Routine Log
 */
export const deleteRoutineLog = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId || !id) throw new AppError(400, "User ID and Routine ID are required.");

  await beauticareService.deleteRoutine(id, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Routine log deleted successfully"));
});

/**
 * 13. Delete Product Scan
 */
export const deleteProductScan = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId || !id) throw new AppError(400, "User ID and Scan ID are required.");

  await beauticareService.deleteScan(id, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product scan deleted successfully"));
});

/**
 * 14. Get Skincare Metric by ID
 */
export const getMetricById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId || !id) throw new AppError(400, "User ID and Metric ID are required.");

  const metric = await beauticareService.getMetricById(id, userId);
  if (!metric) throw new AppError(404, "Skincare metric not found.");

  return res
    .status(200)
    .json(new ApiResponse(200, metric, "Skincare metric fetched successfully"));
});

/**
 * 15. Get Routine Log by ID
 */
export const getRoutineById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId || !id) throw new AppError(400, "User ID and Routine ID are required.");

  const log = await beauticareService.getRoutineById(id, userId);
  if (!log) throw new AppError(404, "Routine log not found.");

  return res
    .status(200)
    .json(new ApiResponse(200, log, "Routine log fetched successfully"));
});

/**
 * 16. Get Product Scan by ID
 */
export const getProductScanById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId || !id) throw new AppError(400, "User ID and Scan ID are required.");

  const scan = await beauticareService.getScanById(id, userId);
  if (!scan) throw new AppError(404, "Product scan not found.");

  return res
    .status(200)
    .json(new ApiResponse(200, scan, "Product scan fetched successfully"));
});

/**
 * 17. Create Chat Room
 */
export const createChatRoom = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.body?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found.");

  // Verify user exists to avoid foreign key constraint violation
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found with the provided ID.");

  const { title } = req.body;
  const room = await beauticareService.createChatRoom(userId, title);

  return res
    .status(201)
    .json(new ApiResponse(201, room, "Chat room created successfully"));
});

/**
 * 18. Get Chat Rooms
 */
export const getChatRooms = asyncHandler(async (req: any, res: Response) => {
  let userId: string | undefined = (req.user?.id || req.query?.userId) as string | undefined;

  if (!userId) {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id;
  }

  if (!userId) throw new AppError(400, "No user found.");

  // Verify user exists to avoid foreign key constraint violation
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) throw new AppError(404, "User not found with the provided ID.");

  const rooms = await beauticareService.getChatRooms(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, rooms, "Chat rooms fetched successfully"));
});

/**
 * 19. Add Message to Room
 */
export const addMessage = asyncHandler(async (req: any, res: Response) => {
  const { roomId, sender, content } = req.body;

  if (!roomId || !sender || !content) {
    throw new AppError(400, "Room ID, sender, and content are required.");
  }

  const normalizedSender = sender.toUpperCase() as "USER" | "AI";
  if (!["USER", "AI"].includes(normalizedSender)) {
    throw new AppError(400, "Invalid sender type. Expected 'USER' or 'AI'.");
  }

  // Verify room exists to avoid foreign key constraint violation
  const roomExists = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!roomExists) throw new AppError(404, "Chat room not found.");

  const message = await beauticareService.addChatMessage(roomId, normalizedSender, content);

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message added successfully"));
});

/**
 * 20. Get Room Messages
 */
export const getMessages = asyncHandler(async (req: any, res: Response) => {
  const { roomId } = req.params;

  if (!roomId) throw new AppError(400, "Room ID is required.");

  const messages = await beauticareService.getChatMessages(roomId);

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});
