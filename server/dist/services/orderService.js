"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusService = exports.getAllOrdersService = exports.getMyOrdersService = exports.placeOrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_1 = __importDefault(require("../models/cart"));
const order_1 = __importDefault(require("../models/order"));
const address_1 = __importDefault(require("../models/address"));
const apiError_1 = require("../utils/apiError");
// Place Order
const placeOrderService = async (userId, paymentMethod, deliveryAddress) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Verify Address
        const address = await address_1.default.findById(deliveryAddress).session(session);
        if (!address) {
            throw new apiError_1.ApiError(404, "Delivery address not found");
        }
        if (address.user.toString() !== userId) {
            throw new apiError_1.ApiError(403, "Unauthorized address");
        }
        // Get Cart
        const cart = await cart_1.default.findOne({
            user: userId,
        })
            .populate("items.food")
            .session(session);
        if (!cart || cart.items.length === 0) {
            throw new apiError_1.ApiError(400, "Cart is empty");
        }
        let totalAmount = 0;
        const orderItems = cart.items.map((item) => {
            const price = item.food.price;
            totalAmount +=
                price * item.quantity;
            return {
                food: item.food._id,
                name: item.food.name,
                price,
                quantity: item.quantity,
            };
        });
        const order = await order_1.default.create([
            {
                user: userId,
                deliveryAddress,
                items: orderItems,
                totalAmount,
                paymentMethod,
            },
        ], { session });
        // Clear Cart
        cart.items = [];
        await cart.save({
            session,
        });
        await session.commitTransaction();
        return order[0];
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.placeOrderService = placeOrderService;
// Get My Orders
const getMyOrdersService = async (userId) => {
    return await order_1.default.find({
        user: userId,
    })
        .populate("deliveryAddress")
        .sort({
        createdAt: -1,
    });
};
exports.getMyOrdersService = getMyOrdersService;
// Get All Orders
const getAllOrdersService = async () => {
    return await order_1.default.find()
        .populate("user", "name email")
        .populate("deliveryAddress")
        .sort({
        createdAt: -1,
    });
};
exports.getAllOrdersService = getAllOrdersService;
// Update Order Status
const updateOrderStatusService = async (orderId, orderStatus) => {
    const order = await order_1.default.findById(orderId);
    if (!order) {
        throw new apiError_1.ApiError(404, "Order not found");
    }
    const validTransitions = {
        PLACED: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["PREPARING", "CANCELLED"],
        PREPARING: ["OUT_FOR_DELIVERY"],
        OUT_FOR_DELIVERY: ["DELIVERED"],
        DELIVERED: [],
        CANCELLED: [],
    };
    if (!validTransitions[order.orderStatus]?.includes(orderStatus)) {
        throw new apiError_1.ApiError(400, `Cannot change order status from ${order.orderStatus} to ${orderStatus}`);
    }
    order.orderStatus =
        orderStatus;
    await order.save();
    return order;
};
exports.updateOrderStatusService = updateOrderStatusService;
