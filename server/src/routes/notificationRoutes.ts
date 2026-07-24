import express from "express";

import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendWelcomeNotification,
  sendForgotPasswordNotification,
  sendOrderPlacedNotification,
  sendDeliveredNotification,
  sendPaymentSuccessNotification,
  sendRefundNotification,
} from "../controllers/notificationController";

import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// User In-App Notifications
router.get("/", protect, getMyNotifications);
router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

// Admin Email Dispatch Notifications
router.post("/welcome", protect, adminOnly, sendWelcomeNotification);
router.post("/forgot-password", protect, adminOnly, sendForgotPasswordNotification);
router.post("/order", protect, adminOnly, sendOrderPlacedNotification);
router.post("/delivered", protect, adminOnly, sendDeliveredNotification);
router.post("/payment", protect, adminOnly, sendPaymentSuccessNotification);
router.post("/refund", protect, adminOnly, sendRefundNotification);

export default router;