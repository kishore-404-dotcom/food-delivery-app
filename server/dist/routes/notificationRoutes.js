"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Welcome Email
router.post("/welcome", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendWelcomeNotification);
// Forgot Password Email
router.post("/forgot-password", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendForgotPasswordNotification);
// Order Email
router.post("/order", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendOrderPlacedNotification);
// Delivered Email
router.post("/delivered", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendDeliveredNotification);
// Payment Email
router.post("/payment", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendPaymentSuccessNotification);
// Refund Email
router.post("/refund", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendRefundNotification);
exports.default = router;
