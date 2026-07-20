import express from "express";

import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByFood,
  getMyReviews,
  getReviewById,
  getAllReviews,
  adminDeleteReview,
} from "../controllers/reviewController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";

import validateRequest from "../middleware/validateRequest";

import {
  reviewValidator,
  reviewIdValidator,
  foodIdValidator,
  reviewQueryValidator,
} from "../validators/reviewValidator";

const router = express.Router();

// Create Review
router.post(
  "/",
  protect,
  reviewValidator,
  validateRequest,
  createReview
);

// Logged-in user's reviews
router.get(
  "/my-reviews",
  protect,
  getMyReviews
);

// Reviews of a Food
router.get(
  "/food/:foodId",
  foodIdValidator,
  reviewQueryValidator,
  validateRequest,
  getReviewsByFood
);

// Get Review By ID
router.get(
  "/:id",
  reviewIdValidator,
  validateRequest,
  getReviewById
);

// Update Review
router.put(
  "/:id",
  protect,
  reviewIdValidator,
  reviewValidator,
  validateRequest,
  updateReview
);

// Delete Own Review
router.delete(
  "/:id",
  protect,
  reviewIdValidator,
  validateRequest,
  deleteReview
);

// ----------------------
// Admin Routes
// ----------------------

// Get All Reviews
router.get(
  "/",
  protect,
  adminOnly,
  reviewQueryValidator,
  validateRequest,
  getAllReviews
);

// Delete Any Review
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  reviewIdValidator,
  validateRequest,
  adminDeleteReview
);

export default router;