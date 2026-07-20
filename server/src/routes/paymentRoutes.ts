import express from "express";

import {
  createPayment,
  getMyPayments,
  getPaymentById,
  paymentSuccess,
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

// Dummy Success
router.put(
  "/success/:id",
  protect,
  paymentLimiter,
  paymentIdValidator,
  validateRequest,
  paymentSuccess
);

// Dummy Failed
router.put(
  "/failed/:id",
  protect,
  paymentLimiter,
  paymentIdValidator,
  validateRequest,
  paymentFailed
);

export default router;  