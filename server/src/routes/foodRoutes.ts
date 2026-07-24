import express from "express";

import upload from "../middleware/uploadMiddleware";
import validateRequest from "../middleware/validateRequest";
import {
  foodValidator,
  foodIdValidator,
  foodSearchValidator,
  foodUpdateValidator,
} from "../validators/foodValidator";

import {
  createFood,
  getFoods,
  searchFoods,
  getFoodsByCategory,
  getFood,
  updateFood,
  updateFoodImage,
  deleteFood,
} from "../controllers/foodController";

import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// Create food
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  foodValidator,
  validateRequest,
  createFood
);

// Get all foods
router.get("/", getFoods);

// Search foods
router.get("/search", foodSearchValidator, validateRequest, searchFoods);

// Get foods by category
router.get("/category/:category", getFoodsByCategory);

// Get food by ID
router.get("/:id", foodIdValidator, validateRequest, getFood);

// Update food (supports multipart/form-data optional image upload)
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  foodUpdateValidator,
  validateRequest,
  updateFood
);

// Update food image
router.put(
  "/:id/image",
  protect,
  adminOnly,
  upload.single("image"),
  foodIdValidator,
  validateRequest,
  updateFoodImage
);

// Delete food
router.delete(
  "/:id",
  protect,
  adminOnly,
  foodIdValidator,
  validateRequest,
  deleteFood
);

export default router;
