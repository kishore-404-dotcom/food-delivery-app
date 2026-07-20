"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPaymentsService = exports.paymentFailedService = exports.paymentSuccessService = exports.getPaymentByIdService = exports.getMyPaymentsService = exports.createPaymentService = void 0;
const cart_1 = __importDefault(require("../models/cart"));
const order_1 = __importDefault(require("../models/order"));
const payment_1 = __importDefault(require("../models/payment"));
const apiError_1 = require("../utils/apiError");
// Generate Dummy Payment ID
const generatePaymentId = () => {
    return `PAY_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
};
// Create Payment
const createPaymentService = async (userId, orderId) => {
    // Check order
    const order = await order_1.default.findById(orderId);
    if (!order) {
        throw new apiError_1.ApiError(404, "Order not found");
    }
    // Verify ownership
    if (order.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "You are not authorized to access this order");
    }
    // Prevent duplicate payment
    const existingPayment = await payment_1.default.findOne({
        order: orderId,
    });
    if (existingPayment) {
        throw new apiError_1.ApiError(400, "Payment already exists for this order");
    }
    const payment = await payment_1.default.create({
        user: userId,
        order: order._id,
        amount: order.totalAmount,
        paymentId: generatePaymentId(),
        paymentMethod: "DUMMY",
        status: "PENDING",
    });
    return payment;
};
exports.createPaymentService = createPaymentService;
// Get Logged-in User Payments
const getMyPaymentsService = async (userId) => {
    return await payment_1.default.find({
        user: userId,
    })
        .populate("order")
        .sort({
        createdAt: -1,
    });
};
exports.getMyPaymentsService = getMyPaymentsService;
// Get Payment By ID
const getPaymentByIdService = async (paymentId, userId) => {
    const payment = await payment_1.default.findById(paymentId)
        .populate("order");
    if (!payment) {
        throw new apiError_1.ApiError(404, "Payment not found");
    }
    if (payment.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized access");
    }
    return payment;
};
exports.getPaymentByIdService = getPaymentByIdService;
// Payment Success
const paymentSuccessService = async (paymentId) => {
    const payment = await payment_1.default.findById(paymentId);
    if (!payment) {
        throw new apiError_1.ApiError(404, "Payment not found");
    }
    if (payment.status === "SUCCESS") {
        throw new apiError_1.ApiError(400, "Payment already completed");
    }
    payment.status = "SUCCESS";
    await payment.save();
    const order = await order_1.default.findById(payment.order);
    if (order) {
        order.paymentStatus = "PAID";
        await order.save();
    }
    // Clear cart after successful payment
    const cart = await cart_1.default.findOne({
        user: payment.user,
    });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    return payment;
};
exports.paymentSuccessService = paymentSuccessService;
// Payment Failed
const paymentFailedService = async (paymentId) => {
    const payment = await payment_1.default.findById(paymentId);
    if (!payment) {
        throw new apiError_1.ApiError(404, "Payment not found");
    }
    payment.status = "FAILED";
    await payment.save();
    const order = await order_1.default.findById(payment.order);
    if (order) {
        order.paymentStatus = "FAILED";
        await order.save();
    }
    return payment;
};
exports.paymentFailedService = paymentFailedService;
// Admin - Get All Payments
const getAllPaymentsService = async () => {
    return await payment_1.default.find()
        .populate("user", "name email")
        .populate("order")
        .sort({
        createdAt: -1,
    });
};
exports.getAllPaymentsService = getAllPaymentsService;
