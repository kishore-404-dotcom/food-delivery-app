import express from "express";

import {
  createRestaurant,
  getAllRestaurants,
  searchRestaurants,
  getRestaurantsByCategory,
  getRestaurantById,
  getMyRestaurant,
  updateRestaurant,
  updateRestaurantImage,
  deleteRestaurant,
} from "../controllers/restaurantController";

import {
  protect,
  restaurantOwnerOrAdmin,
} from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import validateRequest from "../middleware/validateRequest";
import {
  RestaurantValidator,
  restaurantIdValidator,
  restaurantSearchValidator,
  restaurantUpdateValidator,
} from "../validators/restaurantValidator";

const router = express.Router();

// Create restaurant
router.post(
  "/",
  protect,
  restaurantOwnerOrAdmin,
  upload.single("image"),
  RestaurantValidator,
  validateRequest,
  createRestaurant
);

// Get all restaurants
router.get("/", getAllRestaurants);

router.get(
  "/mine",
  protect,
  restaurantOwnerOrAdmin,
  getMyRestaurant
);

// Search restaurants
router.get("/search", restaurantSearchValidator, validateRequest, searchRestaurants);

// Get restaurants by category
router.get("/category/:category", getRestaurantsByCategory);

// Get restaurant by ID
router.get("/:id", restaurantIdValidator, validateRequest, getRestaurantById);

// Update restaurant details (supports multipart/form-data optional image upload)
router.put(
  "/:id",
  protect,
  restaurantOwnerOrAdmin,
  upload.single("image"),
  restaurantUpdateValidator,
  validateRequest,
  updateRestaurant
);

// Update restaurant image
router.put(
  "/:id/image",
  protect,
  restaurantOwnerOrAdmin,
  upload.single("image"),
  restaurantIdValidator,
  validateRequest,
  updateRestaurantImage
);

// Delete restaurant
router.delete(
  "/:id",
  protect,
  restaurantOwnerOrAdmin,
  restaurantIdValidator,
  validateRequest,
  deleteRestaurant
);

export default router;
