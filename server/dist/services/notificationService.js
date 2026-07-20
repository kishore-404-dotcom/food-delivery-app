"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefundEmail = exports.sendPaymentSuccessEmail = exports.sendDeliveredEmail = exports.sendOrderPlacedEmail = exports.sendForgotPasswordEmail = exports.sendWelcomeEmail = void 0;
const emailService_1 = require("./emailService");
const authTemplates_1 = require("../templates/authTemplates");
const orderTemplates_1 = require("../templates/orderTemplates");
const paymentTemplates_1 = require("../templates/paymentTemplates");
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
