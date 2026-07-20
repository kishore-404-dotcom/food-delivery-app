"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToCart = exports.checkWishlist = exports.clearWishlist = exports.removeFromWishlist = exports.getWishlist = exports.addToWishlist = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const wishlistService_1 = require("../services/wishlistService");
exports.addToWishlist = (0, asyncHandler_1.default)(async (req, res) => {
    const { foodId } = req.body;
    const wishlist = await (0, wishlistService_1.addToWishlistService)(req.user.id, foodId);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Added to wishlist", wishlist));
});
exports.getWishlist = (0, asyncHandler_1.default)(async (req, res) => {
    const wishlist = await (0, wishlistService_1.getWishlistService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Wishlist fetched", wishlist));
});
exports.removeFromWishlist = (0, asyncHandler_1.default)(async (req, res) => {
    const { foodId } = req.body;
    const wishlist = await (0, wishlistService_1.removeFromWishlistService)(req.user.id, foodId);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Removed successfully", wishlist));
});
exports.clearWishlist = (0, asyncHandler_1.default)(async (req, res) => {
    await (0, wishlistService_1.clearWishlistService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Wishlist cleared"));
});
exports.checkWishlist = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await (0, wishlistService_1.isWishlistedService)(req.user.id, req.params.foodId);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Status fetched", result));
});
exports.moveToCart = (0, asyncHandler_1.default)(async (req, res) => {
    const { foodId } = req.body;
    const cart = await (0, wishlistService_1.moveToCartService)(req.user.id, foodId);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Moved to cart", cart));
});
