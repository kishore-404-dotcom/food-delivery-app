import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { JWT_SECRET } from "../config/env";
import { ApiError } from "../utils/apiError";
import { JwtPayload } from "../types/jwtPayload";

// Extended request with authenticated user
export interface AuthRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {}
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: JwtPayload;
}

// Verify JWT token
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Check authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authorized. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

// Verify admin access
export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Find logged-in user
    const user = await User.findById(req.user?.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check admin role
    if (user.role !== "admin") {
      throw new ApiError(403, "Access denied. Admin only.");
    }

    next();
  } catch (error) {
    next(error);
  }
};