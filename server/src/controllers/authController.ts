import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import {
  registerUser,
  loginUser,
} from "../services/authService";
import User from "../models/user";
import { AuthRequest } from "../middleware/authMiddleware";

// Register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(201).json(
    new ApiResponse(true, "User registered successfully", user)
  );
});

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await loginUser(email, password);

  res.status(200).json(
    new ApiResponse(true, "Login successful", result)
  );
});

// Get logged-in user profile
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    // Find logged-in user
    const user = await User.findById(req.user?.id).select("-password");

    res.status(200).json(
      new ApiResponse(true, "Profile fetched successfully", user)
    );

  }
);