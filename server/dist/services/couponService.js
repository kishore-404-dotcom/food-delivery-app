"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCouponService = exports.applyCouponService = exports.getCouponByCodeService = exports.getCouponsService = exports.createCouponService = void 0;
const coupon_1 = __importDefault(require("../models/coupon"));
const apiError_1 = require("../utils/apiError");
// Create coupon
const createCouponService = async (couponData) => {
    const existingCoupon = await coupon_1.default.findOne({
        code: couponData.code.toUpperCase(),
    });
    if (existingCoupon) {
        throw new apiError_1.ApiError(400, "Coupon already exists");
    }
    return await coupon_1.default.create({
        ...couponData,
        code: couponData.code.toUpperCase(),
    });
};
exports.createCouponService = createCouponService;
// Get all coupons
const getCouponsService = async () => {
    return await coupon_1.default.find().sort({
        createdAt: -1,
    });
};
exports.getCouponsService = getCouponsService;
// Get coupon by code
const getCouponByCodeService = async (code) => {
    const coupon = await coupon_1.default.findOne({
        code: code.toUpperCase(),
    });
    if (!coupon) {
        throw new apiError_1.ApiError(404, "Coupon not found");
    }
    return coupon;
};
exports.getCouponByCodeService = getCouponByCodeService;
// Apply coupon
const applyCouponService = async (code, totalAmount) => {
    const coupon = await coupon_1.default.findOne({
        code: code.toUpperCase(),
    });
    if (!coupon) {
        throw new apiError_1.ApiError(404, "Coupon not found");
    }
    if (!coupon.isActive) {
        throw new apiError_1.ApiError(400, "Coupon is inactive");
    }
    if (new Date() > coupon.expiryDate) {
        throw new apiError_1.ApiError(400, "Coupon has expired");
    }
    if (totalAmount <
        coupon.minOrderAmount) {
        throw new apiError_1.ApiError(400, `Minimum order amount is ₹${coupon.minOrderAmount}`);
    }
    let discount = 0;
    // Flat discount
    if (coupon.discountType ===
        "flat") {
        discount =
            coupon.discountValue;
    }
    // Percentage discount
    if (coupon.discountType ===
        "percentage") {
        discount =
            (totalAmount *
                coupon.discountValue) /
                100;
    }
    const finalAmount = totalAmount - discount;
    return {
        coupon,
        discount,
        finalAmount,
    };
};
exports.applyCouponService = applyCouponService;
// Delete coupon
const deleteCouponService = async (id) => {
    const coupon = await coupon_1.default.findById(id);
    if (!coupon) {
        throw new apiError_1.ApiError(404, "Coupon not found");
    }
    await coupon.deleteOne();
};
exports.deleteCouponService = deleteCouponService;
