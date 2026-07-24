"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.placeOrder = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = __importDefault(require("../config/logger"));
const socket_1 = require("../socket");
const notificationService_1 = require("../services/notificationService");
const orderService_1 = require("../services/orderService");
// Place Order
exports.placeOrder = (0, asyncHandler_1.default)(async (req, res) => {
    const order = await (0, orderService_1.placeOrderService)(req.user.id, req.body.paymentMethod, req.body.deliveryAddress);
    (0, socket_1.emitToUser)(req.user.id, "order:created", order);
    (0, socket_1.emitToAdmins)("order:created", order);
    try {
        const notification = await (0, notificationService_1.createInAppNotificationService)(req.user.id, "Order placed", `Your order ${order._id.toString()} was placed successfully.`, "ORDER");
        (0, socket_1.emitToUser)(req.user.id, "notification:new", notification);
    }
    catch (error) {
        logger_1.default.error("Failed to create real-time order notification:", error);
    }
    res.status(201).json(new apiResponse_1.ApiResponse(true, "Order placed successfully", order));
});
// Get my orders
exports.getMyOrders = (0, asyncHandler_1.default)(async (req, res) => {
    const orders = await (0, orderService_1.getMyOrdersService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Orders fetched successfully", orders));
});
// Get all orders
exports.getAllOrders = (0, asyncHandler_1.default)(async (_req, res) => {
    const orders = await (0, orderService_1.getAllOrdersService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Orders fetched successfully", orders));
});
// Update order status
exports.updateOrderStatus = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const order = await (0, orderService_1.updateOrderStatusService)(id, req.body.orderStatus);
    const userId = order.user.toString();
    (0, socket_1.emitToUser)(userId, "order:status-updated", order);
    (0, socket_1.emitToAdmins)("order:status-updated", order);
    try {
        const notification = await (0, notificationService_1.createInAppNotificationService)(userId, "Order status updated", `Order ${order._id.toString()} is now ${order.orderStatus.replace(/_/g, " ")}.`, order.orderStatus === "DELIVERED" ? "DELIVERY" : "ORDER");
        (0, socket_1.emitToUser)(userId, "notification:new", notification);
    }
    catch (error) {
        logger_1.default.error("Failed to create real-time status notification:", error);
    }
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Order status updated successfully", order));
});
