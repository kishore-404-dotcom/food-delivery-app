import express from "express";

import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController";

import { protect } from "../middleware/authMiddleware";

import validateRequest from "../middleware/validateRequest";

import {
  cartValidator,
  removeCartItemValidator,
} from "../validators/cartValidator";

const router = express.Router();

// Add item
router.post(
  "/",
  protect,
  cartValidator,
  validateRequest,
  addToCart
);

// Get cart
router.get(
  "/",
  protect,
  getCart
);

// Update quantity
router.put(
  "/",
  protect,
  cartValidator,
  validateRequest,
  updateCart
);

// Remove item
router.delete(
  "/",
  protect,
  removeCartItemValidator,
  validateRequest,
  removeFromCart
);

// Clear cart
router.delete(
  "/clear",
  protect,
  clearCart
);

export default router;