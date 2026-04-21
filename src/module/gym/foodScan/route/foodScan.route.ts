import { Router } from "express";
import * as foodScanController from "../controller/foodScan.controller";
// import { authMiddleware } from "../../../../middlewares/auth.middleware"; // Temporarily commented for public testing

const router = Router();

// router.use(authMiddleware); // Uncomment later for production

router.post("/", foodScanController.createScan);
router.get("/history", foodScanController.getScanHistory);
router.get("/:id", foodScanController.getScanDetails);
router.delete("/:id", foodScanController.deleteScan);

export default router;
