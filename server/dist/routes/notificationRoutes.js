"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// User In-App Notifications
router.get("/", authMiddleware_1.protect, notificationController_1.getMyNotifications);
router.put("/read-all", authMiddleware_1.protect, notificationController_1.markAllAsRead);
router.put("/:id/read", authMiddleware_1.protect, notificationController_1.markAsRead);
router.delete("/:id", authMiddleware_1.protect, notificationController_1.deleteNotification);
// Admin Email Dispatch Notifications
router.post("/welcome", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendWelcomeNotification);
router.post("/forgot-password", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendForgotPasswordNotification);
router.post("/order", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendOrderPlacedNotification);
router.post("/delivered", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendDeliveredNotification);
router.post("/payment", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendPaymentSuccessNotification);
router.post("/refund", authMiddleware_1.protect, authMiddleware_1.adminOnly, notificationController_1.sendRefundNotification);
exports.default = router;
