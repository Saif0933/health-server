import { Router } from "express";
import * as beauticareController from "../controller/beauticare.controller";
import * as beauticareValidator from "../validator/beauticare.validator";

const router = Router();

/**
 * Skincare Metrics Routes
 */
router.post("/metrics", beauticareValidator.validateMetrics, beauticareController.logMetrics);
router.get("/metrics", beauticareController.getMetricsHistory);
router.get("/metrics/:id", beauticareController.getMetricById);

/**
 * Routine Log Routes
 */
router.post("/routine", beauticareValidator.validateRoutine, beauticareController.logRoutine);
router.get("/routine", beauticareController.getRoutineHistory);
router.get("/routine/:id", beauticareController.getRoutineById);

/**
 * Product Scan Routes
 */
router.post("/scan", beauticareValidator.validateProductScan, beauticareController.saveProductScan);
router.get("/scan", beauticareController.getScanHistory);
router.get("/scan/:id", beauticareController.getProductScanById);
router.delete("/scan/:id", beauticareController.deleteProductScan);

/**
 * Profile & Stats Routes
 */
router.get("/profile", beauticareController.getSkinProfile);
router.get("/profile/:userId", beauticareController.getSkinProfile);
router.post("/profile", beauticareValidator.validateSkinProfile, beauticareController.updateSkinProfile);
router.put("/profile", beauticareValidator.validateSkinProfile, beauticareController.updateSkinProfile);
router.get("/stats", beauticareController.getStats);
router.get("/stats/:userId", beauticareController.getStats);
router.get("/achievements", beauticareController.getAchievements);
router.get("/achievements/:userId", beauticareController.getAchievements);

// Fallback for direct ID access (e.g. /api/beauticare/ID)
router.get("/:userId", beauticareController.getStats);

/**
 * Other Deletions
 */
router.delete("/metrics/:id", beauticareController.deleteMetric);
router.delete("/routine/:id", beauticareController.deleteRoutineLog);

/**
 * Chat Routes
 */
router.post("/chat/room", beauticareController.createChatRoom);
router.get("/chat/rooms", beauticareController.getChatRooms);
router.post("/chat/message", beauticareValidator.validateChatMessage, beauticareController.addMessage);
router.post("/chat/messages", beauticareValidator.validateChatMessage, beauticareController.addMessage);
router.get("/chat/messages/:roomId", beauticareController.getMessages);

export default router;
