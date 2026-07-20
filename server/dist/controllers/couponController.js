"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.applyCoupon = exports.getCouponByCode = exports.getCoupons = exports.createCoupon = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const couponService_1 = require("../services/couponService");
// Create coupon
exports.createCoupon = (0, asyncHandler_1.default)(async (req, res) => {
    const coupon = await (0, couponService_1.createCouponService)(req.body);
    res.status(201).json(new apiResponse_1.ApiResponse(true, "Coupon created successfully", coupon));
});
// Get all coupons
exports.getCoupons = (0, asyncHandler_1.default)(async (_req, res) => {
    const coupons = await (0, couponService_1.getCouponsService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Coupons fetched successfully", coupons));
});
// Get coupon by code
exports.getCouponByCode = (0, asyncHandler_1.default)(async (req, res) => {
    const { code } = req.params;
    const coupon = await (0, couponService_1.getCouponByCodeService)(code);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Coupon fetched successfully", coupon));
});
// Apply coupon
exports.applyCoupon = (0, asyncHandler_1.default)(async (req, res) => {
    const { code, totalAmount, } = req.body;
    const result = await (0, couponService_1.applyCouponService)(code, totalAmount);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Coupon applied successfully", result));
});
// Delete coupon
exports.deleteCoupon = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    await (0, couponService_1.deleteCouponService)(id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Coupon deleted successfully"));
});
