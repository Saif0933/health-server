import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { verifyToken } from "../../utils/jwt.utils";
import { ErrorResponse } from "../../utils/response.utils";

export const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Manually parse cookies from the Cookie header if req.cookies is not available
    const cookies = req.headers.cookie
      ?.split(";")
      .reduce((acc: any, curr: string) => {
        const parts = curr.split("=");
        const key = parts[0];
        if (key) {
          acc[key.trim()] = parts[1];
        }
        return acc;
      }, {});
    
    const cookieToken = req.cookies?.token || cookies?.token;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    const authToken = cookieToken || headerToken;

    if (!authToken || typeof authToken !== "string") {
      throw new ErrorResponse("Unauthorized: No token provided", 401, "UNAUTHORIZED");
    }

    // Verify token
    const decoded: any = verifyToken(authToken);

    if (!decoded || !decoded.email) {
      throw new ErrorResponse("Unauthorized: Invalid token payload", 401, "UNAUTHORIZED");
    }

    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      throw new ErrorResponse("Unauthorized: User not found", 401, "UNAUTHORIZED");
    }

    // Attach user to the request
    req.user = user;
    next();
  } catch (error: any) {
    next(new ErrorResponse(
      `Unauthorized: ${error.message || "Invalid token"}`,
      401,
      "UNAUTHORIZED",
    ));
  }
};
