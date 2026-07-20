import Coupon from "../models/coupon";
import { ApiError } from "../utils/apiError";

// Create coupon
export const createCouponService = async (
  couponData: {
    code: string;
    discountType: "flat" | "percentage";
    discountValue: number;
    minOrderAmount: number;
    expiryDate: Date;
    isActive?: boolean;
  }
) => {
  const existingCoupon = await Coupon.findOne({
    code: couponData.code.toUpperCase(),
  });

  if (existingCoupon) {
    throw new ApiError(
      400,
      "Coupon already exists"
    );
  }

  return await Coupon.create({
    ...couponData,
    code: couponData.code.toUpperCase(),
  });
};

// Get all coupons
export const getCouponsService =
  async () => {
    return await Coupon.find().sort({
      createdAt: -1,
    });
  };

// Get coupon by code
export const getCouponByCodeService =
  async (code: string) => {
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      throw new ApiError(
        404,
        "Coupon not found"
      );
    }

    return coupon;
  };

// Apply coupon
export const applyCouponService =
  async (
    code: string,
    totalAmount: number
  ) => {

    const coupon =
      await Coupon.findOne({
        code: code.toUpperCase(),
      });

    if (!coupon) {
      throw new ApiError(
        404,
        "Coupon not found"
      );
    }

    if (!coupon.isActive) {
      throw new ApiError(
        400,
        "Coupon is inactive"
      );
    }

    if (
      new Date() > coupon.expiryDate
    ) {
      throw new ApiError(
        400,
        "Coupon has expired"
      );
    }

    if (
      totalAmount <
      coupon.minOrderAmount
    ) {
      throw new ApiError(
        400,
        `Minimum order amount is ₹${coupon.minOrderAmount}`
      );
    }

    let discount = 0;

    // Flat discount
    if (
      coupon.discountType ===
      "flat"
    ) {
      discount =
        coupon.discountValue;
    }

    // Percentage discount
    if (
      coupon.discountType ===
      "percentage"
    ) {
      discount =
        (totalAmount *
          coupon.discountValue) /
        100;
    }

    const finalAmount =
      totalAmount - discount;

    return {
      coupon,
      discount,
      finalAmount,
    };
  };

// Delete coupon
export const deleteCouponService =
  async (id: string) => {

    const coupon =
      await Coupon.findById(id);

    if (!coupon) {
      throw new ApiError(
        404,
        "Coupon not found"
      );
    }

    await coupon.deleteOne();
  };