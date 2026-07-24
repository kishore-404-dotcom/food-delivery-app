import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator";

import validateRequest from "../middleware/validateRequest";
import { authLimiter, registerLimiter } from "../middleware/rateLimiter";

const router = express.Router();

// Register user
router.post("/register", registerValidator, validateRequest, registerLimiter, register);

// Login user
router.post("/login", loginValidator, validateRequest, authLimiter, login);

// Get logged-in user profile
router.get("/profile", protect, getProfile);

// Update logged-in user profile
router.put("/profile", protect, updateProfile);

// Change user password
router.put("/change-password", protect, changePassword);

export default router;