import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  createCouponService,
  getCouponsService,
  getCouponByCodeService,
  applyCouponService,
  deleteCouponService,
} from "../services/couponService";

// Create coupon
export const createCoupon = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const coupon = await createCouponService(
      req.body
    );

    res.status(201).json(
      new ApiResponse(
        true,
        "Coupon created successfully",
        coupon
      )
    );
  }
);

// Get all coupons
export const getCoupons = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const coupons =
      await getCouponsService();

    res.status(200).json(
      new ApiResponse(
        true,
        "Coupons fetched successfully",
        coupons
      )
    );
  }
);

// Get coupon by code
export const getCouponByCode =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const { code } =
        req.params as {
          code: string;
        };

      const coupon =
        await getCouponByCodeService(
          code
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Coupon fetched successfully",
          coupon
        )
      );
    }
  );

// Apply coupon
export const applyCoupon =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const {
        code,
        totalAmount,
      } = req.body;

      const result =
        await applyCouponService(
          code,
          totalAmount
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Coupon applied successfully",
          result
        )
      );
    }
  );

// Delete coupon
export const deleteCoupon =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const { id } =
        req.params as {
          id: string;
        };

      await deleteCouponService(id);

      res.status(200).json(
        new ApiResponse(
          true,
          "Coupon deleted successfully"
        )
      );
    }
  );