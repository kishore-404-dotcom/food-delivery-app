"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusService = exports.getAllOrdersService = exports.getMyOrdersService = exports.placeOrderService = void 0;
const cart_1 = __importDefault(require("../models/cart"));
const order_1 = __importDefault(require("../models/order"));
const apiError_1 = require("../utils/apiError");
// Place order
const placeOrderService = async (userId, paymentMethod) => {
    const cart = await cart_1.default.findOne({
        user: userId,
    }).populate("items.food");
    if (!cart || cart.items.length === 0) {
        throw new apiError_1.ApiError(400, "Cart is empty");
    }
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
        const price = item.food.price;
        totalAmount += price * item.quantity;
        return {
            food: item.food._id,
            name: item.food.name,
            price,
            quantity: item.quantity,
        };
    });
    const order = await order_1.default.create({
        user: userId,
        items: orderItems,
        totalAmount,
        paymentMethod,
    });
    /*
      Clear cart only for COD.
  
      For ONLINE payment, cart will be cleared
      after payment is successful.
    */
    if (paymentMethod === "COD") {
        cart.items = [];
        await cart.save();
    }
    return order;
};
exports.placeOrderService = placeOrderService;
// Get logged-in user's orders
const getMyOrdersService = async (userId) => {
    return await order_1.default.find({
        user: userId,
    }).sort({
        createdAt: -1,
    });
};
exports.getMyOrdersService = getMyOrdersService;
// Get all orders
const getAllOrdersService = async () => {
    return await order_1.default.find()
        .populate("user", "name email")
        .sort({
        createdAt: -1,
    });
};
exports.getAllOrdersService = getAllOrdersService;
// Update order status
const updateOrderStatusService = async (orderId, orderStatus) => {
    const order = await order_1.default.findById(orderId);
    if (!order) {
        throw new apiError_1.ApiError(404, "Order not found");
    }
    order.orderStatus = orderStatus;
    await order.save();
    return order;
};
exports.updateOrderStatusService = updateOrderStatusService;
