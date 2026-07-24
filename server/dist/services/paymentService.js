"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPaymentsService = exports.getPaymentByIdService = exports.getMyPaymentsService = exports.paymentFailedService = exports.verifyPaymentService = exports.createPaymentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = __importDefault(require("../models/order"));
const payment_1 = __importDefault(require("../models/payment"));
const user_1 = __importDefault(require("../models/user"));
const env_1 = require("../config/env");
const paymentProvider_1 = require("../providers/paymentProvider");
const apiError_1 = require("../utils/apiError");
const razorpaySignature_1 = require("../utils/razorpaySignature");
const assertPayableOrder = (order) => {
    if (order.paymentMethod !== "ONLINE") {
        throw new apiError_1.ApiError(400, "Razorpay is only available for online orders");
    }
    if (order.paymentStatus === "PAID") {
        throw new apiError_1.ApiError(409, "Order has already been paid");
    }
    if (["CANCELLED", "DELIVERED"].includes(order.orderStatus)) {
        throw new apiError_1.ApiError(410, "Order is no longer eligible for payment");
    }
};
const buildCheckoutPayload = (payment, user) => {
    if (!payment.razorpayOrderId) {
        throw new apiError_1.ApiError(500, "Razorpay order reference is missing");
    }
    return {
        keyId: env_1.RAZORPAY_KEY_ID,
        razorpayOrderId: payment.razorpayOrderId,
        amount: Math.round(payment.amount * 100),
        currency: payment.currency,
        prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
        },
    };
};
const createPaymentService = async (userId, orderId) => {
    const [order, user] = await Promise.all([
        order_1.default.findById(orderId),
        user_1.default.findById(userId),
    ]);
    if (!order)
        throw new apiError_1.ApiError(404, "Order not found");
    if (!user)
        throw new apiError_1.ApiError(404, "User not found");
    if (order.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "You are not authorized to access this order");
    }
    assertPayableOrder(order);
    const existingPayment = await payment_1.default.findOne({ order: orderId }).sort({
        createdAt: -1,
    });
    if (existingPayment?.status === "SUCCESS") {
        throw new apiError_1.ApiError(409, "Order has already been paid");
    }
    // Reuse an open gateway order so network retries do not create duplicate attempts.
    if (existingPayment?.status === "PENDING" &&
        existingPayment.paymentMethod === "RAZORPAY" &&
        existingPayment.razorpayOrderId) {
        return buildCheckoutPayload(existingPayment, user);
    }
    const amountInPaise = Math.round(order.totalAmount * 100);
    if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
        throw new apiError_1.ApiError(400, "Order total is not payable");
    }
    const provider = new paymentProvider_1.RazorpayPaymentProvider();
    const providerOrder = await provider.createOrder(amountInPaise, `order_${order._id.toString()}`.slice(0, 40), { orderId: order._id.toString(), userId });
    if (providerOrder.amount !== amountInPaise ||
        providerOrder.currency !== "INR") {
        throw new apiError_1.ApiError(502, "Razorpay returned an unexpected order amount");
    }
    let payment;
    if (existingPayment) {
        existingPayment.amount = order.totalAmount;
        existingPayment.currency = providerOrder.currency;
        existingPayment.paymentId = providerOrder.id;
        existingPayment.razorpayOrderId = providerOrder.id;
        existingPayment.razorpayPaymentId = undefined;
        existingPayment.paymentMethod = "RAZORPAY";
        existingPayment.status = "PENDING";
        existingPayment.failureReason = undefined;
        existingPayment.verifiedAt = undefined;
        payment = await existingPayment.save();
    }
    else {
        payment = await payment_1.default.create({
            user: userId,
            order: order._id,
            amount: order.totalAmount,
            currency: providerOrder.currency,
            paymentId: providerOrder.id,
            razorpayOrderId: providerOrder.id,
            paymentMethod: "RAZORPAY",
            status: "PENDING",
        });
    }
    if (order.paymentStatus === "FAILED") {
        order.paymentStatus = "PENDING";
        await order.save();
    }
    return buildCheckoutPayload(payment, user);
};
exports.createPaymentService = createPaymentService;
const verifyPaymentService = async (userId, input) => {
    const payment = await payment_1.default.findOne({
        razorpayOrderId: input.razorpayOrderId,
        user: userId,
    });
    if (!payment)
        throw new apiError_1.ApiError(404, "Payment attempt not found");
    if (!(0, razorpaySignature_1.verifyRazorpaySignature)(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
        throw new apiError_1.ApiError(400, "Razorpay signature verification failed");
    }
    if (payment.status === "SUCCESS") {
        if (payment.razorpayPaymentId !== input.razorpayPaymentId) {
            throw new apiError_1.ApiError(409, "Order was verified with a different payment");
        }
        return payment;
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const sessionPayment = await payment_1.default.findById(payment._id).session(session);
        if (!sessionPayment)
            throw new apiError_1.ApiError(404, "Payment attempt not found");
        const order = await order_1.default.findById(sessionPayment.order).session(session);
        if (!order)
            throw new apiError_1.ApiError(404, "Order not found");
        if (order.user.toString() !== userId) {
            throw new apiError_1.ApiError(403, "Unauthorized payment verification");
        }
        if (order.paymentStatus === "PAID" && sessionPayment.status !== "SUCCESS") {
            throw new apiError_1.ApiError(409, "Order has already been paid");
        }
        if (["CANCELLED", "DELIVERED"].includes(order.orderStatus)) {
            throw new apiError_1.ApiError(410, "Order is no longer eligible for payment");
        }
        sessionPayment.razorpayPaymentId = input.razorpayPaymentId;
        sessionPayment.paymentId = input.razorpayPaymentId;
        sessionPayment.status = "SUCCESS";
        sessionPayment.failureReason = undefined;
        sessionPayment.verifiedAt = new Date();
        await sessionPayment.save({ session });
        order.paymentStatus = "PAID";
        if (order.orderStatus === "PLACED")
            order.orderStatus = "CONFIRMED";
        await order.save({ session });
        await session.commitTransaction();
        return sessionPayment;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
exports.verifyPaymentService = verifyPaymentService;
const paymentFailedService = async (userId, razorpayOrderId, reason, abandoned) => {
    const payment = await payment_1.default.findOne({
        razorpayOrderId,
        user: userId,
    });
    if (!payment)
        throw new apiError_1.ApiError(404, "Payment attempt not found");
    if (payment.status === "SUCCESS") {
        throw new apiError_1.ApiError(409, "A successful payment cannot be marked as failed");
    }
    payment.status = abandoned ? "ABANDONED" : "FAILED";
    payment.failureReason = reason.slice(0, 500);
    await payment.save();
    await order_1.default.updateOne({ _id: payment.order, user: userId, paymentStatus: { $ne: "PAID" } }, { $set: { paymentStatus: "FAILED" } });
    return payment;
};
exports.paymentFailedService = paymentFailedService;
const getMyPaymentsService = async (userId) => payment_1.default.find({ user: userId }).populate("order").sort({ createdAt: -1 });
exports.getMyPaymentsService = getMyPaymentsService;
const getPaymentByIdService = async (paymentId, userId) => {
    const payment = await payment_1.default.findById(paymentId).populate("order");
    if (!payment)
        throw new apiError_1.ApiError(404, "Payment not found");
    if (payment.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized access");
    }
    return payment;
};
exports.getPaymentByIdService = getPaymentByIdService;
const getAllPaymentsService = async (page, limit, sort = "-createdAt", status, paymentMethod, search) => {
    const filter = {};
    if (status)
        filter.status = status;
    if (paymentMethod)
        filter.paymentMethod = paymentMethod;
    if (search) {
        filter.$or = [
            { paymentId: { $regex: search, $options: "i" } },
            { razorpayOrderId: { $regex: search, $options: "i" } },
            { razorpayPaymentId: { $regex: search, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
        payment_1.default.find(filter)
            .populate("user", "name email")
            .populate("order")
            .sort(sort)
            .skip(skip)
            .limit(limit),
        payment_1.default.countDocuments(filter),
    ]);
    return {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        payments,
    };
};
exports.getAllPaymentsService = getAllPaymentsService;
