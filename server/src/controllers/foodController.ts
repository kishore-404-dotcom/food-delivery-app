import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";
import uploadToCloudinary from "../utils/uploadToCloudinary";

import {
  createFoodService,
  getFoodsService,
  searchFoodsService,
  getFoodsByCategoryService,
  getFoodByIdService,
  updateFoodService,
  deleteFoodService,
} from "../services/foodService";

// Create food
export const createFood = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "foods"
      );
    }

    const food = await createFoodService({
      ...req.body,
      image: imageUrl,
    });

    res.status(201).json(
      new ApiResponse(
        true,
        "Food created successfully",
        food
      )
    );
  }
);

// Get all foods
export const getFoods = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const foods = await getFoodsService();

    res.status(200).json(
      new ApiResponse(
        true,
        "Foods fetched successfully",
        foods
      )
    );
  }
);

// Search foods
export const searchFoods = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name = "" } = req.query as {
      name?: string;
    };

    const foods =
      await searchFoodsService(name);

    res.status(200).json(
      new ApiResponse(
        true,
        "Foods fetched successfully",
        foods
      )
    );
  }
);

// Get foods by category
export const getFoodsByCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { category } = req.params as {
      category: string;
    };

    const foods =
      await getFoodsByCategoryService(
        category
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Foods fetched successfully",
        foods
      )
    );
  }
);

// Get food by ID
export const getFood = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as {
      id: string;
    };

    const food =
      await getFoodByIdService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Food fetched successfully",
        food
      )
    );
  }
);

// Update food
export const updateFood = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as {
      id: string;
    };

    const food =
      await updateFoodService(
        id,
        req.body
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Food updated successfully",
        food
      )
    );
  }
);

// Update food image
export const updateFoodImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as {
      id: string;
    };

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "foods"
      );
    }

    const food =
      await updateFoodService(id, {
        image: imageUrl,
      });

    res.status(200).json(
      new ApiResponse(
        true,
        "Food image updated successfully",
        food
      )
    );
  }
);

// Delete food
export const deleteFood = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as {
      id: string;
    };

    await deleteFoodService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Food deleted successfully"
      )
    );
  }
);