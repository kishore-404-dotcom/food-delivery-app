import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { ApiError } from "../utils/apiError";
import { JWT_SECRET } from "../config/env";

// Register user
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  const { name, email, password, phone } = userData;

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  // Remove password before returning
  const { password: _, ...userResponse } = user.toObject();

  return userResponse;
};

// Login user
export const loginUser = async (
  email: string,
  password: string
) => {
  // Find user
  const user = await User.findOne({ email });

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
    { id: user._id.toString() },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Remove password before returning
  const { password: _, ...userResponse } = user.toObject();

  return {
    token,
    user: userResponse,
  };
};