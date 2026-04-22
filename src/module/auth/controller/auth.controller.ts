import { type Request, type Response } from "express";
import { registerUser, loginUser, googleLogin } from "../service/auth.service";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse } from "../../../utils/ApiResponse";
import { prisma } from "../../../config/prisma";
import { AppError } from "../../../utils/AppError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const result = await registerUser(email, password);

  return res
    .status(201)
    .json(new ApiResponse(201, result, "User registered successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const result = await loginUser(email, password);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Login successful"));
});

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new Error("Google ID Token is required");
  }

  const result = await googleLogin(idToken);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Google login successful"));
});

export const getMe = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const { password: _, ...userWithoutPassword } = user;

  return res
    .status(200)
    .json(new ApiResponse(200, userWithoutPassword, "User profile fetched successfully"));
});
