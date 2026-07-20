import express from "express";
import { register, login, getProfile } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator";

import validateRequest from "../middleware/validateRequest";

import {
  authLimiter,
} from "../middleware/rateLimiter";

const router = express.Router();

// Register user
router.post("/register", registerValidator, validateRequest,authLimiter, register);

// Login user
router.post("/login", loginValidator, validateRequest, authLimiter, login);

// Get logged-in user
router.get("/profile", protect, getProfile);



export default router;