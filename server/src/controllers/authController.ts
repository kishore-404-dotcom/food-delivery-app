import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import {
  registerUser,
  loginUser,
  updateUserProfileService,
  changePasswordService,
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
    const user = await User.findById(req.user?.id).select("-password");

    res.status(200).json(
      new ApiResponse(true, "Profile fetched successfully", user)
    );
  }
);

// Update logged-in user profile
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, phone } = req.body;

    const updatedUser = await updateUserProfileService(req.user!.id, {
      name,
      phone,
    });

    res.status(200).json(
      new ApiResponse(true, "Profile updated successfully", updatedUser)
    );
  }
);

// Change password
export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    await changePasswordService(req.user!.id, currentPassword, newPassword);

    res.status(200).json(
      new ApiResponse(true, "Password changed successfully")
    );
  }
);