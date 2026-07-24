import express from "express";

import {
  createPayment,
  getMyPayments,
  getPaymentById,
  verifyPayment,
  paymentFailed,
  getAllPayments,
} from "../controllers/paymentController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";

import validateRequest from "../middleware/validateRequest";

import {
  paymentValidator,
  paymentIdValidator,
  paymentVerificationValidator,
  paymentFailureValidator,
  paymentQueryValidator,
} from "../validators/paymentValidator";

import {
  paymentLimiter,
} from "../middleware/rateLimiter";

const router = express.Router();

// Create Payment
router.post(
  "/create",
  protect,
  paymentLimiter,
  paymentValidator,
  validateRequest,
  createPayment
);

// Get My Payments
router.get(
  "/my-payments",
  protect,
  getMyPayments
);

// Admin - Get All Payments
router.get(
  "/",
  protect,
  adminOnly,
  paymentQueryValidator,
  validateRequest,
  getAllPayments
);

// Get Payment By ID
router.get(
  "/:id",
  protect,
  paymentIdValidator,
  validateRequest,
  getPaymentById
);

// Verify a Razorpay payment signature
router.post(
  "/verify",
  protect,
  paymentLimiter,
  paymentVerificationValidator,
  validateRequest,
  verifyPayment
);

// Record a failed or abandoned Razorpay checkout
router.post(
  "/failure",
  protect,
  paymentLimiter,
  paymentFailureValidator,
  validateRequest,
  paymentFailed
);

export default router;
