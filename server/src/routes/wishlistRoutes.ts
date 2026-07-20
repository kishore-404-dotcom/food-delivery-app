import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
  moveToCart,
} from "../controllers/wishlistController";

import {
  protect,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  addToWishlist
);

router.get(
  "/",
  protect,
  getWishlist
);

router.delete(
  "/",
  protect,
  removeFromWishlist
);

router.delete(
  "/clear",
  protect,
  clearWishlist
);

router.get(
  "/check/:foodId",
  protect,
  checkWishlist
);

router.post(
  "/move-to-cart",
  protect,
  moveToCart
);

export default router;