"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPaymentsService = exports.paymentFailedService = exports.paymentSuccessService = exports.getPaymentByIdService = exports.getMyPaymentsService = exports.createPaymentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_1 = __importDefault(require("../models/cart"));
const order_1 = __importDefault(require("../models/order"));
const payment_1 = __importDefault(require("../models/payment"));
const apiError_1 = require("../utils/apiError");
const paymentProvider_1 = require("../providers/paymentProvider");
const paymentProvider = new paymentProvider_1.DummyPaymentProvider();
// Create Payment
const createPaymentService = async (userId, orderId) => {
    const order = await order_1.default.findById(orderId);
    if (!order) {
        throw new apiError_1.ApiError(404, "Order not found");
    }
    if (order.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "You are not authorized to access this order");
    }
    if (order.paymentStatus === "PAID") {
        throw new apiError_1.ApiError(400, "Order has already been paid");
    }
    const existingPayment = await payment_1.default.findOne({
        order: orderId,
    });
    if (existingPayment) {
        throw new apiError_1.ApiError(400, "Payment already exists for this order");
    }
    const providerPayment = (await paymentProvider.createPayment(order.totalAmount));
    const payment = await payment_1.default.create({
        user: userId,
        order: order._id,
        amount: order.totalAmount,
        paymentId: providerPayment.paymentId,
        paymentMethod: providerPayment.paymentMethod,
        status: "PENDING",
    });
    return payment;
};
exports.createPaymentService = createPaymentService;
// Get My Payments
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
    const payment = await payment_1.default.findById(paymentId).populate("order");
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
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const payment = await payment_1.default.findById(paymentId).session(session);
        if (!payment) {
            throw new apiError_1.ApiError(404, "Payment not found");
        }
        if (payment.status === "SUCCESS") {
            throw new apiError_1.ApiError(400, "Payment already completed");
        }
        payment.status = "SUCCESS";
        await payment.save({
            session,
        });
        const order = await order_1.default.findById(payment.order).session(session);
        if (!order) {
            throw new apiError_1.ApiError(404, "Order not found");
        }
        order.paymentStatus = "PAID";
        order.orderStatus = "CONFIRMED";
        await order.save({
            session,
        });
        const cart = await cart_1.default.findOne({
            user: payment.user,
        }).session(session);
        if (cart) {
            cart.items = [];
            await cart.save({
                session,
            });
        }
        await session.commitTransaction();
        return payment;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.paymentSuccessService = paymentSuccessService;
// Payment Failed
const paymentFailedService = async (paymentId) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const payment = await payment_1.default.findById(paymentId).session(session);
        if (!payment) {
            throw new apiError_1.ApiError(404, "Payment not found");
        }
        if (payment.status === "FAILED") {
            throw new apiError_1.ApiError(400, "Payment already failed");
        }
        payment.status = "FAILED";
        await payment.save({
            session,
        });
        const order = await order_1.default.findById(payment.order).session(session);
        if (!order) {
            throw new apiError_1.ApiError(404, "Order not found");
        }
        order.paymentStatus = "FAILED";
        order.orderStatus = "CANCELLED";
        await order.save({
            session,
        });
        await session.commitTransaction();
        return payment;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.paymentFailedService = paymentFailedService;
// Get All Payments
const getAllPaymentsService = async (page, limit, sort = "-createdAt", status, paymentMethod, search) => {
    const filter = {};
    if (status) {
        filter.status = status;
    }
    if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
    }
    if (search) {
        filter.paymentId = {
            $regex: search,
            $options: "i",
        };
    }
    const skip = (page - 1) * limit;
    const payments = await payment_1.default.find(filter)
        .populate("user", "name email")
        .populate("order")
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await payment_1.default.countDocuments(filter);
    return {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        payments,
    };
};
exports.getAllPaymentsService = getAllPaymentsService;
