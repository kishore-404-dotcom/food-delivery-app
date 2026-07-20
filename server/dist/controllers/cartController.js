"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCart = exports.getCart = exports.addToCart = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const cartService_1 = require("../services/cartService");
// Add item to cart
exports.addToCart = (0, asyncHandler_1.default)(async (req, res) => {
    const { foodId, quantity } = req.body;
    const cart = await (0, cartService_1.addToCartService)(req.user.id, foodId, quantity);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Item added to cart", cart));
});
// Get logged-in user's cart
exports.getCart = (0, asyncHandler_1.default)(async (_req, res) => {
    const cart = await (0, cartService_1.getCartService)(_req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Cart fetched successfully", cart));
});
// Update cart quantity
exports.updateCart = (0, asyncHandler_1.default)(async (req, res) => {
    const { foodId, quantity } = req.body;
    const cart = await (0, cartService_1.updateCartService)(req.user.id, foodId, quantity);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Cart updated successfully", cart));
});
// Remove item from cart
exports.removeFromCart = (0, asyncHandler_1.default)(async (req, res) => {
    const { foodId } = req.body;
    const cart = await (0, cartService_1.removeFromCartService)(req.user.id, foodId);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Item removed from cart", cart));
});
// Clear cart
exports.clearCart = (0, asyncHandler_1.default)(async (req, res) => {
    await (0, cartService_1.clearCartService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Cart cleared successfully"));
});
