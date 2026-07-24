import express from "express";

import {
  createCoupon,
  getCoupons,
  getCouponByCode,
  applyCoupon,
  deleteCoupon,
} from "../controllers/couponController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";

import validateRequest from "../middleware/validateRequest";
import {
  couponApplyValidator,
  couponIdValidator,
  couponValidator,
} from "../validators/couponValidator";

const router = express.Router();

// Create coupon (Admin only)
router.post(
  "/",
  protect,
  adminOnly,
  couponValidator,
  validateRequest,
  createCoupon
);

// Get all coupons
router.get("/", getCoupons);

// Get coupon by code
router.get("/:code", getCouponByCode);

// Apply coupon
router.post(
  "/apply",
  protect,
  couponApplyValidator,
  validateRequest,
  applyCoupon
);

// Delete coupon (Admin only)
router.delete(
  "/:id",
  protect,
  adminOnly,
  couponIdValidator,
  validateRequest,
  deleteCoupon
);

export default router;
