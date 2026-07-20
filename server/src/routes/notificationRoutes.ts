import express from "express";

import {
  sendWelcomeNotification,
  sendForgotPasswordNotification,
  sendOrderPlacedNotification,
  sendDeliveredNotification,
  sendPaymentSuccessNotification,
  sendRefundNotification,
} from "../controllers/notificationController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";


const router = express.Router();


// Welcome Email
router.post(
  "/welcome",
  protect,
  adminOnly,
  sendWelcomeNotification
);


// Forgot Password Email
router.post(
  "/forgot-password",
  protect,
  adminOnly,
  sendForgotPasswordNotification
);


// Order Email
router.post(
  "/order",
  protect,
  adminOnly,
  sendOrderPlacedNotification
);


// Delivered Email
router.post(
  "/delivered",
  protect,
  adminOnly,
  sendDeliveredNotification
);


// Payment Email
router.post(
  "/payment",
  protect,
  adminOnly,
  sendPaymentSuccessNotification
);


// Refund Email
router.post(
  "/refund",
  protect,
  adminOnly,
  sendRefundNotification
);


export default router;