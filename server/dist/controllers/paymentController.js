"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPayments = exports.paymentFailed = exports.verifyPayment = exports.getPaymentById = exports.getMyPayments = exports.createPayment = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const paymentService_1 = require("../services/paymentService");
// Create Payment
exports.createPayment = (0, asyncHandler_1.default)(async (req, res) => {
    const { orderId } = req.body;
    const payment = await (0, paymentService_1.createPaymentService)(req.user.id, orderId);
    res.status(201).json(new apiResponse_1.ApiResponse(true, "Payment created successfully", payment));
});
// Get My Payments
exports.getMyPayments = (0, asyncHandler_1.default)(async (req, res) => {
    const payments = await (0, paymentService_1.getMyPaymentsService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Payments fetched successfully", payments));
});
// Get Payment By ID
exports.getPaymentById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const payment = await (0, paymentService_1.getPaymentByIdService)(id, req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Payment fetched successfully", payment));
});
// Verify Razorpay signature before marking the payment successful
exports.verifyPayment = (0, asyncHandler_1.default)(async (req, res) => {
    const payment = await (0, paymentService_1.verifyPaymentService)(req.user.id, {
        razorpayOrderId: req.body.razorpayOrderId,
        razorpayPaymentId: req.body.razorpayPaymentId,
        razorpaySignature: req.body.razorpaySignature,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Payment verified successfully", payment));
});
// Payment Failed
exports.paymentFailed = (0, asyncHandler_1.default)(async (req, res) => {
    const payment = await (0, paymentService_1.paymentFailedService)(req.user.id, req.body.razorpayOrderId, req.body.reason, req.body.abandoned === true);
    res.status(200).json(new apiResponse_1.ApiResponse(true, req.body.abandoned ? "Payment marked as abandoned" : "Payment marked as failed", payment));
});
// Get All Payments (Admin)
exports.getAllPayments = (0, asyncHandler_1.default)(async (req, res) => {
    const { page, limit, sort, status, paymentMethod, search, } = req.query;
    const payments = await (0, paymentService_1.getAllPaymentsService)(Number(page) || 1, Number(limit) || 10, sort || "-createdAt", status, paymentMethod, search);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Payments fetched successfully", payments));
});
