import express from "express";
import { body, param } from "express-validator";
import { protect, adminOnly } from "../middleware/authMiddleware";
import validateRequest from "../middleware/validateRequest";
import {
  getRestaurantOwners,
  updateRestaurantOwnerStatus,
} from "../controllers/restaurantOwnerController";

const router = express.Router();

// Test Admin Route
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin 🎉",
  });
});

router.get(
  "/restaurant-owners",
  protect,
  adminOnly,
  getRestaurantOwners
);

router.patch(
  "/restaurant-owners/:id/status",
  protect,
  adminOnly,
  param("id").isMongoId().withMessage("Invalid restaurant owner ID"),
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be approved or rejected"),
  validateRequest,
  updateRestaurantOwnerStatus
);

export default router;
