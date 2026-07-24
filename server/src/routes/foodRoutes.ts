import express from "express";

import upload from "../middleware/uploadMiddleware";
import validateRequest from "../middleware/validateRequest";
import { foodValidator } from "../validators/foodValidator";

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
router.get("/search", searchFoods);

// Get foods by category
router.get("/category/:category", getFoodsByCategory);

// Get food by ID
router.get("/:id", getFood);

// Update food (supports multipart/form-data optional image upload)
router.put("/:id", protect, adminOnly, upload.single("image"), updateFood);

// Update food image
router.put(
  "/:id/image",
  protect,
  adminOnly,
  upload.single("image"),
  updateFoodImage
);

// Delete food
router.delete("/:id", protect, adminOnly, deleteFood);

export default router;