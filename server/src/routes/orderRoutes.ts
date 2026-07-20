import express from "express";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";

import validateRequest from "../middleware/validateRequest";

import {
  orderValidator,
  orderStatusValidator,
} from "../validators/orderValidator";

const router = express.Router();

// Place order
router.post(
  "/",
  protect,
  orderValidator,
  validateRequest,
  placeOrder
);

// Get my orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Get all orders (admin)
router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);

// Update order status (admin)
router.put(
  "/:id",
  protect,
  adminOnly,
  orderStatusValidator,
  validateRequest,
  updateOrderStatus
);

export default router;