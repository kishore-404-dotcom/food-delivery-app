"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToCartService = exports.isWishlistedService = exports.clearWishlistService = exports.removeFromWishlistService = exports.getWishlistService = exports.addToWishlistService = void 0;
const wishlist_1 = __importDefault(require("../models/wishlist"));
const cart_1 = __importDefault(require("../models/cart"));
const apiError_1 = require("../utils/apiError");
const addToWishlistService = async (userId, foodId) => {
    let wishlist = await wishlist_1.default.findOne({
        user: userId,
    });
    if (!wishlist) {
        wishlist =
            await wishlist_1.default.create({
                user: userId,
                items: [],
            });
    }
    const exists = wishlist.items.find((item) => item.food.toString() ===
        foodId);
    if (exists) {
        throw new apiError_1.ApiError(400, "Food already exists in wishlist");
    }
    wishlist.items.push({
        food: foodId,
    });
    await wishlist.save();
    return wishlist;
};
exports.addToWishlistService = addToWishlistService;
const getWishlistService = async (userId) => {
    return await wishlist_1.default.findOne({
        user: userId,
    }).populate("items.food");
};
exports.getWishlistService = getWishlistService;
const removeFromWishlistService = async (userId, foodId) => {
    const wishlist = await wishlist_1.default.findOne({
        user: userId,
    });
    if (!wishlist) {
        throw new apiError_1.ApiError(404, "Wishlist not found");
    }
    wishlist.items =
        wishlist.items.filter((item) => item.food.toString() !==
            foodId);
    await wishlist.save();
    return wishlist;
};
exports.removeFromWishlistService = removeFromWishlistService;
const clearWishlistService = async (userId) => {
    const wishlist = await wishlist_1.default.findOne({
        user: userId,
    });
    if (wishlist) {
        wishlist.items = [];
        await wishlist.save();
    }
};
exports.clearWishlistService = clearWishlistService;
const isWishlistedService = async (userId, foodId) => {
    const wishlist = await wishlist_1.default.findOne({
        user: userId,
    });
    if (!wishlist)
        return false;
    return wishlist.items.some((item) => item.food.toString() ===
        foodId);
};
exports.isWishlistedService = isWishlistedService;
const moveToCartService = async (userId, foodId) => {
    let cart = await cart_1.default.findOne({
        user: userId,
    });
    if (!cart) {
        cart =
            await cart_1.default.create({
                user: userId,
                items: [],
            });
    }
    const exists = cart.items.find((item) => item.food.toString() ===
        foodId);
    if (!exists) {
        cart.items.push({
            food: foodId,
            quantity: 1,
        });
        await cart.save();
    }
    await (0, exports.removeFromWishlistService)(userId, foodId);
    return cart;
};
exports.moveToCartService = moveToCartService;
