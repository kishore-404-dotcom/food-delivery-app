import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { ApiError } from "../utils/apiError";
import { FRONTEND_URL, JWT_SECRET } from "../config/env";
import { sendForgotPasswordEmail } from "./notificationService";
import logger from "../config/logger";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const hashResetToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Register user
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "customer" | "restaurant_owner";
}) => {
  const { name, password, phone, role = "customer" } = userData;
  const email = normalizeEmail(userData.email);

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  // Hash credentials before persisting them.
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    ...(role === "restaurant_owner" ? { restaurantStatus: "pending" } : {}),
  });

  // Remove password before returning
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    ...(user.restaurantStatus
      ? { restaurantStatus: user.restaurantStatus }
      : {}),
  };
};

// Login user
export const loginUser = async (emailInput: string, password: string) => {
  const email = normalizeEmail(emailInput);

  // Find user
  const user = await User.findOne({ email }).select("+authVersion");

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id.toString(),
      authVersion: user.authVersion ?? 0,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Remove password before returning
  const {
    password: _,
    authVersion: _authVersion,
    ...userResponse
  } = user.toObject();

  return {
    token,
    user: userResponse,
  };
};

// Update Profile (Allowed fields: name, phone)
export const updateUserProfileService = async (
  userId: string,
  data: { name?: string; phone?: string }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (data.name) user.name = data.name.trim();
  if (data.phone) user.phone = data.phone.trim();

  await user.save();

  const { password: _, ...userResponse } = user.toObject();
  return userResponse;
};

// Change Password
export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select(
    "+authVersion +resetPasswordToken +resetPasswordExpires"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Incorrect current password");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters long");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordChangedAt = new Date();
  user.authVersion = (user.authVersion ?? 0) + 1;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Password updated successfully" };
};

export const requestPasswordResetService = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+resetPasswordToken +resetPasswordExpires"
  );

  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = hashResetToken(rawToken);
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  try {
    const resetUrl = new URL("/reset-password", FRONTEND_URL);
    resetUrl.searchParams.set("token", rawToken);
    await sendForgotPasswordEmail(user.email, resetUrl.toString());
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    logger.error("Password reset email delivery failed", {
      error: error instanceof Error ? error.message : "Unknown mail error",
    });
  }
};

export const resetPasswordService = async (
  rawToken: string,
  newPassword: string
) => {
  const tokenHash = hashResetToken(rawToken);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await User.findOneAndUpdate(
    {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    },
    {
      $set: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
      $inc: { authVersion: 1 },
      $unset: {
        resetPasswordToken: 1,
        resetPasswordExpires: 1,
      },
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(400, "Password reset link is invalid or has expired");
  }

};
