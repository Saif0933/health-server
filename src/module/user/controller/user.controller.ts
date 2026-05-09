import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../config/prisma";
import { type User } from "../../../types/types";
import { ErrorResponse, SuccessResponse } from "../../../utils/response.utils";
import { type IUpdateProfileRequest } from "../types/user.types";

export const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    if (!user) {
      throw new ErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
    }

    const data = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    return res.status(200).json(SuccessResponse("Profile retrieved successfully", data, 200));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const body = req.body as IUpdateProfileRequest;

    if(!user){
      throw new ErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
    }

    const data = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...body,
        isProfileCompleted: true,
      },
    });

    return res.status(200).json(SuccessResponse("Profile updated successfully", data, 200));
  } catch (error) {
    next(error);
  }
};
