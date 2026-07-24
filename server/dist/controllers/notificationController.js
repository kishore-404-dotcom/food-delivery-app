"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefundNotification = exports.sendPaymentSuccessNotification = exports.sendDeliveredNotification = exports.sendOrderPlacedNotification = exports.sendForgotPasswordNotification = exports.sendWelcomeNotification = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getMyNotifications = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const notificationService_1 = require("../services/notificationService");
// Get My In-App Notifications
exports.getMyNotifications = (0, asyncHandler_1.default)(async (req, res) => {
    const notifications = await (0, notificationService_1.getUserNotificationsService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Notifications fetched", notifications));
});
// Mark single notification as read
exports.markAsRead = (0, asyncHandler_1.default)(async (req, res) => {
    const updated = await (0, notificationService_1.markNotificationAsReadService)(req.params.id, req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Notification marked as read", updated));
});
// Mark all notifications as read
exports.markAllAsRead = (0, asyncHandler_1.default)(async (req, res) => {
    await (0, notificationService_1.markAllNotificationsAsReadService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "All notifications marked as read"));
});
// Delete single notification
exports.deleteNotification = (0, asyncHandler_1.default)(async (req, res) => {
    await (0, notificationService_1.deleteNotificationService)(req.params.id, req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Notification deleted"));
});
// Welcome Email
exports.sendWelcomeNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, name } = req.body;
    await (0, notificationService_1.sendWelcomeEmail)(email, name);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Welcome email sent successfully"));
});
// Forgot Password Email
exports.sendForgotPasswordNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, link } = req.body;
    await (0, notificationService_1.sendForgotPasswordEmail)(email, link);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Reset password email sent successfully"));
});
// Order Placed Email
exports.sendOrderPlacedNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, orderId } = req.body;
    await (0, notificationService_1.sendOrderPlacedEmail)(email, orderId);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Order email sent successfully"));
});
// Delivered Email
exports.sendDeliveredNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, orderId } = req.body;
    await (0, notificationService_1.sendDeliveredEmail)(email, orderId);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Delivered email sent successfully"));
});
// Payment Success Email
exports.sendPaymentSuccessNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, amount } = req.body;
    await (0, notificationService_1.sendPaymentSuccessEmail)(email, amount);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Payment email sent successfully"));
});
// Refund Email
exports.sendRefundNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, amount } = req.body;
    await (0, notificationService_1.sendRefundEmail)(email, amount);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Refund email sent successfully"));
});
