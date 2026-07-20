"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCartService = exports.removeFromCartService = exports.updateCartService = exports.getCartService = exports.addToCartService = void 0;
const cart_1 = __importDefault(require("../models/cart"));
const apiError_1 = require("../utils/apiError");
// Add item to cart
const addToCartService = async (userId, foodId, quantity) => {
    let cart = await cart_1.default.findOne({ user: userId });
    // Create cart if it doesn't exist
    if (!cart) {
        cart = await cart_1.default.create({
            user: userId,
            items: [],
        });
    }
    // Check if item already exists
    const existingItem = cart.items.find((item) => item.food.toString() === foodId);
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        cart.items.push({
            food: foodId,
            quantity,
        });
    }
    await cart.save();
    return cart.populate("items.food");
};
exports.addToCartService = addToCartService;
// Get cart
const getCartService = async (userId) => {
    return await cart_1.default.findOne({
        user: userId,
    }).populate("items.food");
};
exports.getCartService = getCartService;
// Update quantity
const updateCartService = async (userId, foodId, quantity) => {
    const cart = await cart_1.default.findOne({
        user: userId,
    });
    if (!cart) {
        throw new apiError_1.ApiError(404, "Cart not found");
    }
    const item = cart.items.find((i) => i.food.toString() === foodId);
    if (!item) {
        throw new apiError_1.ApiError(404, "Food not found in cart");
    }
    item.quantity = quantity;
    await cart.save();
    return cart.populate("items.food");
};
exports.updateCartService = updateCartService;
// Remove item
const removeFromCartService = async (userId, foodId) => {
    const cart = await cart_1.default.findOne({
        user: userId,
    });
    if (!cart) {
        throw new apiError_1.ApiError(404, "Cart not found");
    }
    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);
    await cart.save();
    return cart.populate("items.food");
};
exports.removeFromCartService = removeFromCartService;
// Clear cart
const clearCartService = async (userId) => {
    const cart = await cart_1.default.findOne({
        user: userId,
    });
    if (!cart) {
        throw new apiError_1.ApiError(404, "Cart not found");
    }
    cart.items = [];
    await cart.save();
};
exports.clearCartService = clearCartService;
