import type { Request, Response, NextFunction } from "express";
import { type IAuthPayload } from "../types/user.types";
import { ErrorResponse, SuccessResponse } from "../../../utils/response.utils";
import { prisma } from "../../../config/prisma";
import { generateToken } from "../../../utils/jwt.utils";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, avatar } = req.body as IAuthPayload;
    
    if (!email || !name) {
      throw new ErrorResponse("Name and Email are required", 400);
    }

    let user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatar,
          isEmailVerified: true,
          provider: "GOOGLE",
        },
      });
    }

    const token = generateToken(user);

    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 604800000, // 7 days in milliseconds
      sameSite: "lax",
    });

    return res.status(200).json(SuccessResponse("Login successful", { 
      token, 
      ...user, 
      id: user.id.toString() 
    }));
  } catch (error) {
    next(error);
  }
};
