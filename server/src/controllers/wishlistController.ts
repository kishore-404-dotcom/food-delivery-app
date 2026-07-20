import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
  clearWishlistService,
  isWishlistedService,
  moveToCartService,
} from "../services/wishlistService";



export const addToWishlist =
  asyncHandler(
    async (
      req: AuthRequest & { params: { foodId: string } },
      res: Response
    ) => {

      const { foodId } = req.body;

      const wishlist =
        await addToWishlistService(
          req.user!.id,
          foodId
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Added to wishlist",
          wishlist
        )
      );
    }
  );



export const getWishlist =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const wishlist =
        await getWishlistService(
          req.user!.id
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Wishlist fetched",
          wishlist
        )
      );
    }
  );



export const removeFromWishlist =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const { foodId } = req.body;

      const wishlist =
        await removeFromWishlistService(
          req.user!.id,
          foodId
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Removed successfully",
          wishlist
        )
      );
    }
  );



export const clearWishlist =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      await clearWishlistService(
        req.user!.id
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Wishlist cleared"
        )
      );
    }
  );



export const checkWishlist =
  asyncHandler(
    async (
      req: AuthRequest & { params: { foodId: string } },
      res: Response
    ) => {

      const result =
        await isWishlistedService(
          req.user!.id,
          req.params.foodId
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Status fetched",
          result
        )
      );
    }
  );



export const moveToCart =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const { foodId } = req.body;

      const cart =
        await moveToCartService(
          req.user!.id,
          foodId
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Moved to cart",
          cart
        )
      );
    }
  );