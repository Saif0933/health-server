import { z } from "zod";
import { type Request, type Response, type NextFunction } from "express";

export const validateRequest = (schema: z.ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.issues.map(e => ({
            field: e.path.join("."),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
};

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().nonempty({ message: "Password is required" }),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().nonempty({ message: "Google ID Token is required" }),
  }),
});
