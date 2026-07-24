import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";
import Food from "../models/food";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadToCloudinary";

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
    let imagePublicId = "";

    // Upload image to Cloudinary
    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "foods"
      );
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const food = await createFoodService({
      name: req.body.name,
      description: req.body.description || req.body.name,
      price: Number(req.body.price),
      category: req.body.category || "Main Course",
      restaurant: req.body.restaurant,
      image: imageUrl,
      imagePublicId,
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
    const { name = "" } = req.query as { name?: string };

    const foods = await searchFoodsService(name);

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
    const { category } = req.params as { category: string };

    const foods = await getFoodsByCategoryService(category);

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
    const { id } = req.params as { id: string };

    const food = await getFoodByIdService(id);

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
    const { id } = req.params as { id: string };
    const existing = await Food.findById(id);

    const updateData: any = { ...req.body };

    if (req.file) {
      if (existing?.imagePublicId) {
        await deleteFromCloudinary(existing.imagePublicId);
      }
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "foods"
      );
      updateData.image = uploadRes.secure_url;
      updateData.imagePublicId = uploadRes.public_id;
    }

    const food = await updateFoodService(id, updateData);

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
    const { id } = req.params as { id: string };
    const existing = await Food.findById(id);

    let imageUrl = existing?.image || "";
    let imagePublicId = existing?.imagePublicId || "";

    if (req.file) {
      if (existing?.imagePublicId) {
        await deleteFromCloudinary(existing.imagePublicId);
      }
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "foods"
      );
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
    }

    const food = await updateFoodService(id, {
      image: imageUrl,
      imagePublicId,
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
    const { id } = req.params as { id: string };

    await deleteFoodService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Food deleted successfully"
      )
    );
  }
);