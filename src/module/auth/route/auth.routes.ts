import { Router } from "express";
import { register, login, googleAuth, getMe } from "../controller/auth.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { validateRequest, registerSchema, loginSchema, googleAuthSchema } from "../validator/auth.validator";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/google", validateRequest(googleAuthSchema), googleAuth);
router.get("/me", authMiddleware, getMe);

export default router;
