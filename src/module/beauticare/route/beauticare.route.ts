import { Router } from "express";
import * as beauticareController from "../controller/beauticare.controller";

const router = Router();

/**
 * Skincare Metrics Routes
 */
router.post("/metrics", beauticareController.logMetrics);
router.get("/metrics", beauticareController.getMetricsHistory);

/**
 * Routine Log Routes
 */
router.post("/routine", beauticareController.logRoutine);
router.get("/routine", beauticareController.getRoutineHistory);

/**
 * Product Scan Routes
 */
router.post("/scan", beauticareController.saveProductScan);
router.get("/scan", beauticareController.getScanHistory);

export default router;
