import express from "express";

import {
  createAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllAddresses,
} from "../controllers/addressController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";

import validateRequest from "../middleware/validateRequest";

import {
  addressValidator,
  addressIdValidator,
  addressQueryValidator,
} from "../validators/addressValidator";

const router = express.Router();

// -------------------------
// User Routes
// -------------------------

// Create Address
router.post(
  "/",
  protect,
  addressValidator,
  validateRequest,
  createAddress
);

// Get My Addresses
router.get(
  "/my-addresses",
  protect,
  getMyAddresses
);

// Get Address By ID
router.get(
  "/:id",
  protect,
  addressIdValidator,
  validateRequest,
  getAddressById
);

// Update Address
router.put(
  "/:id",
  protect,
  addressIdValidator,
  addressValidator,
  validateRequest,
  updateAddress
);

// Delete Address
router.delete(
  "/:id",
  protect,
  addressIdValidator,
  validateRequest,
  deleteAddress
);

// Set Default Address
router.patch(
  "/default/:id",
  protect,
  addressIdValidator,
  validateRequest,
  setDefaultAddress
);

// -------------------------
// Admin Routes
// -------------------------

router.get(
  "/",
  protect,
  adminOnly,
  addressQueryValidator,
  validateRequest,
  getAllAddresses
);

export default router;