import express from "express";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getRestaurantOrders,
  updateOrderStatus,
} from "../controllers/orderController";

import {
  protect,
  adminOnly,
  restaurantOwnerOrAdmin,
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

router.get(
  "/restaurant-orders",
  protect,
  restaurantOwnerOrAdmin,
  getRestaurantOrders
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
  restaurantOwnerOrAdmin,
  orderStatusValidator,
  validateRequest,
  updateOrderStatus
);

export default router;
