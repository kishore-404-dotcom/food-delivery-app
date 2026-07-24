"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInAppNotificationService = exports.deleteNotificationService = exports.markAllNotificationsAsReadService = exports.markNotificationAsReadService = exports.getUserNotificationsService = exports.sendRefundEmail = exports.sendPaymentSuccessEmail = exports.sendDeliveredEmail = exports.sendOrderPlacedEmail = exports.sendForgotPasswordEmail = exports.sendWelcomeEmail = void 0;
const emailService_1 = require("./emailService");
const notification_1 = __importDefault(require("../models/notification"));
const authTemplates_1 = require("../templates/authTemplates");
const orderTemplates_1 = require("../templates/orderTemplates");
const paymentTemplates_1 = require("../templates/paymentTemplates");
// Email Notifications
const sendWelcomeEmail = async (email, name) => {
    await (0, emailService_1.sendMailService)(email, "Welcome", (0, authTemplates_1.welcomeTemplate)(name));
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendForgotPasswordEmail = async (email, link) => {
    await (0, emailService_1.sendMailService)(email, "Reset Password", (0, authTemplates_1.forgotPasswordTemplate)(link));
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
const sendOrderPlacedEmail = async (email, orderId) => {
    await (0, emailService_1.sendMailService)(email, "Order Placed", (0, orderTemplates_1.orderPlacedTemplate)(orderId));
};
exports.sendOrderPlacedEmail = sendOrderPlacedEmail;
const sendDeliveredEmail = async (email, orderId) => {
    await (0, emailService_1.sendMailService)(email, "Order Delivered", (0, orderTemplates_1.deliveredTemplate)(orderId));
};
exports.sendDeliveredEmail = sendDeliveredEmail;
const sendPaymentSuccessEmail = async (email, amount) => {
    await (0, emailService_1.sendMailService)(email, "Payment Successful", (0, paymentTemplates_1.paymentSuccessTemplate)(amount));
};
exports.sendPaymentSuccessEmail = sendPaymentSuccessEmail;
const sendRefundEmail = async (email, amount) => {
    await (0, emailService_1.sendMailService)(email, "Refund Successful", (0, paymentTemplates_1.refundTemplate)(amount));
};
exports.sendRefundEmail = sendRefundEmail;
// In-App Database Notifications
const getUserNotificationsService = async (userId) => {
    return await notification_1.default.find({ user: userId }).sort({ createdAt: -1 });
};
exports.getUserNotificationsService = getUserNotificationsService;
const markNotificationAsReadService = async (notificationId, userId) => {
    const notification = await notification_1.default.findOne({
        _id: notificationId,
        user: userId,
    });
    if (!notification)
        return null;
    notification.isRead = true;
    await notification.save();
    return notification;
};
exports.markNotificationAsReadService = markNotificationAsReadService;
const markAllNotificationsAsReadService = async (userId) => {
    await notification_1.default.updateMany({ user: userId, isRead: false }, { isRead: true });
};
exports.markAllNotificationsAsReadService = markAllNotificationsAsReadService;
const deleteNotificationService = async (notificationId, userId) => {
    await notification_1.default.deleteOne({ _id: notificationId, user: userId });
};
exports.deleteNotificationService = deleteNotificationService;
const createInAppNotificationService = async (userId, title, message, type = "SYSTEM") => {
    return await notification_1.default.create({
        user: userId,
        title,
        message,
        type,
    });
};
exports.createInAppNotificationService = createInAppNotificationService;
