import { ENV } from "../config/env";
import { ErrorResponse } from "../utils/response.utils";
import type{ Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  ENV.mode === "development" && console.log(err);

  // Handle ErrorResponse custom class
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err.statusText,
      success: false,
    });
  }

  // Handle generic errors
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    message: message,
    error: err.statusText || "INTERNAL_SERVER_ERROR",
    success: false,
  });
};
