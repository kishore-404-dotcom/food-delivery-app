import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { ApiError } from "../utils/apiError";
import { FRONTEND_URL, JWT_SECRET } from "../config/env";
import {
  sendEmailVerificationOtp,
  sendForgotPasswordEmail,
  sendWelcomeEmail,
} from "./notificationService";
import logger from "../config/logger";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const EMAIL_OTP_TTL_MS = 10 * 60 * 1000;
const EMAIL_OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const EMAIL_OTP_MAX_ATTEMPTS = 5;
const hashResetToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const createEmailOtp = () => crypto.randomInt(100000, 1000000).toString();
const hashEmailOtp = (email: string, otp: string) =>
  crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${normalizeEmail(email)}:${otp}`)
    .digest("hex");

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

  const otp = createEmailOtp();

  // Hash credentials before persisting them.
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    emailVerified: false,
    emailVerificationOtpHash: hashEmailOtp(email, otp),
    emailVerificationOtpExpires: new Date(Date.now() + EMAIL_OTP_TTL_MS),
    emailVerificationAttempts: 0,
    emailVerificationLastSentAt: new Date(),
    ...(role === "restaurant_owner" ? { restaurantStatus: "pending" } : {}),
  });

  try {
    await sendEmailVerificationOtp(email, otp);
  } catch (error) {
    await User.deleteOne({ _id: user._id });
    logger.error("Registration verification email delivery failed", {
      error: error instanceof Error ? error.message : "Unknown mail error",
    });
    throw new ApiError(
      503,
      "Unable to send the verification email. Please try registering again."
    );
  }

  // Remove password before returning
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified,
    ...(user.restaurantStatus
      ? { restaurantStatus: user.restaurantStatus }
      : {}),
  };
};

export const verifyEmailOtpService = async (emailInput: string, otp: string) => {
  const email = normalizeEmail(emailInput);
  const user = await User.findOne({ email }).select(
    "+emailVerificationOtpHash +emailVerificationOtpExpires +emailVerificationAttempts"
  );

  if (!user || user.role === "admin") {
    throw new ApiError(400, "Invalid or expired verification OTP");
  }

  if (user.emailVerified) {
    return { email: user.email, emailVerified: true };
  }

  if (
    !user.emailVerificationOtpHash ||
    !user.emailVerificationOtpExpires ||
    user.emailVerificationOtpExpires.getTime() <= Date.now()
  ) {
    throw new ApiError(400, "Verification OTP has expired. Request a new OTP.");
  }

  if ((user.emailVerificationAttempts ?? 0) >= EMAIL_OTP_MAX_ATTEMPTS) {
    throw new ApiError(429, "Too many incorrect OTP attempts. Request a new OTP.");
  }

  const submittedHash = hashEmailOtp(email, otp);
  const storedHash = Buffer.from(user.emailVerificationOtpHash, "hex");
  const submittedHashBuffer = Buffer.from(submittedHash, "hex");
  const matches =
    storedHash.length === submittedHashBuffer.length &&
    crypto.timingSafeEqual(storedHash, submittedHashBuffer);

  if (!matches) {
    user.emailVerificationAttempts = (user.emailVerificationAttempts ?? 0) + 1;
    await user.save();
    throw new ApiError(400, "Invalid or expired verification OTP");
  }

  user.emailVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailVerificationOtpHash = undefined;
  user.emailVerificationOtpExpires = undefined;
  user.emailVerificationAttempts = 0;
  user.emailVerificationLastSentAt = undefined;
  await user.save();

  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    logger.warn("Welcome email delivery failed", {
      error: error instanceof Error ? error.message : "Unknown mail error",
    });
  }

  return { email: user.email, emailVerified: true };
};

export const resendEmailVerificationOtpService = async (emailInput: string) => {
  const email = normalizeEmail(emailInput);
  const user = await User.findOne({ email }).select(
    "+emailVerificationOtpHash +emailVerificationOtpExpires +emailVerificationAttempts +emailVerificationLastSentAt"
  );

  if (!user || user.role === "admin" || user.emailVerified) {
    return;
  }

  if (
    user.emailVerificationLastSentAt &&
    Date.now() - user.emailVerificationLastSentAt.getTime() <
      EMAIL_OTP_RESEND_COOLDOWN_MS
  ) {
    throw new ApiError(429, "Please wait one minute before requesting another OTP.");
  }

  const otp = createEmailOtp();
  user.emailVerificationOtpHash = hashEmailOtp(email, otp);
  user.emailVerificationOtpExpires = new Date(Date.now() + EMAIL_OTP_TTL_MS);
  user.emailVerificationAttempts = 0;
  user.emailVerificationLastSentAt = new Date();
  await user.save();

  try {
    await sendEmailVerificationOtp(email, otp);
  } catch (error) {
    user.emailVerificationOtpHash = undefined;
    user.emailVerificationOtpExpires = undefined;
    user.emailVerificationLastSentAt = undefined;
    await user.save();
    logger.error("Verification OTP resend failed", {
      error: error instanceof Error ? error.message : "Unknown mail error",
    });
    throw new ApiError(503, "Unable to send verification email. Please try again.");
  }
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

  // Existing administrators predate email verification and remain accessible.
  if (user.role !== "admin" && !user.emailVerified) {
    throw new ApiError(403, "Email verification required");
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
