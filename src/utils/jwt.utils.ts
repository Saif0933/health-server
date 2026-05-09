import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import type { User } from "../types/types";

/** JWT payload must be JSON-serializable (Prisma `User` has `id: bigint`, which breaks `JSON.stringify`). */
export const generateToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    },
    ENV.jwtSecret!,
    { expiresIn: "100d" },
  );
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, ENV.jwtSecret!)
}