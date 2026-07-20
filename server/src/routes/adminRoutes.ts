import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// Test Admin Route
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin 🎉",
  });
});

export default router;