import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  addToCartService,
  getCartService,
  updateCartService,
  removeFromCartService,
  clearCartService,
} from "../services/cartService";

// Add item to cart
export const addToCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { foodId, quantity } = req.body;

    const cart = await addToCartService(
      req.user!.id,
      foodId,
      quantity
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Item added to cart",
        cart
      )
    );
  }
);

// Get logged-in user's cart
export const getCart = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const cart = await getCartService(_req.user!.id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Cart fetched successfully",
        cart
      )
    );
  }
);

// Update cart quantity
export const updateCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { foodId, quantity } = req.body;

    const cart = await updateCartService(
      req.user!.id,
      foodId,
      quantity
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Cart updated successfully",
        cart
      )
    );
  }
);

// Remove item from cart
export const removeFromCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { foodId } = req.body;

    const cart = await removeFromCartService(
      req.user!.id,
      foodId
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Item removed from cart",
        cart
      )
    );
  }
);

// Clear cart
export const clearCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await clearCartService(req.user!.id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Cart cleared successfully"
      )
    );
  }
);