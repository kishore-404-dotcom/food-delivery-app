import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import {
  registerUser,
  loginUser,
  updateUserProfileService,
  changePasswordService,
  requestPasswordResetService,
  resetPasswordService,
  resendEmailVerificationOtpService,
  verifyEmailOtpService,
} from "../services/authService";
import User from "../models/user";
import { AuthRequest } from "../middleware/authMiddleware";

// Register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    role: req.body.role,
  });

  res.status(201).json(
    new ApiResponse(
      true,
      "Registration started. Enter the OTP sent to your email.",
      user
    )
  );
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await verifyEmailOtpService(req.body.email, req.body.otp);

  res.status(200).json(
    new ApiResponse(true, "Email verified successfully. You can now login.", result)
  );
});

export const resendVerificationOtp = asyncHandler(
  async (req: Request, res: Response) => {
    await resendEmailVerificationOtpService(req.body.email);

    res.status(200).json(
      new ApiResponse(
        true,
        "If the account is awaiting verification, a new OTP has been sent."
      )
    );
  }
);

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

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await requestPasswordResetService(req.body.email);

    res.status(200).json(
      new ApiResponse(
        true,
        "If an account exists for that email, a password reset link has been sent"
      )
    );
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await resetPasswordService(req.body.token, req.body.newPassword);

    res.status(200).json(
      new ApiResponse(
        true,
        "Password reset successfully. Please login with your new password"
      )
    );
  }
);
