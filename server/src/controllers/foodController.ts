import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";
import Food from "../models/food";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadToCloudinary";
import Restaurant from "../models/restaurant";
import {
  assertCanManageFood,
  assertCanManageRestaurant,
} from "../utils/restaurantOwnership";

import {
  createFoodService,
  getFoodsService,
  searchFoodsService,
  getFoodsByCategoryService,
  getFoodByIdService,
  updateFoodService,
  deleteFoodService,
} from "../services/foodService";

interface FoodUpdateData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  restaurant?: string;
  isAvailable?: boolean;
  image?: string;
  imagePublicId?: string;
}

// Create food
export const createFood = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await assertCanManageRestaurant(req.user!.id, req.body.restaurant);

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

    let food;
    try {
      food = await createFoodService({
        name: req.body.name,
        description: req.body.description || req.body.name,
        price: Number(req.body.price),
        category: req.body.category || "Main Course",
        restaurant: req.body.restaurant,
        image: imageUrl,
        imagePublicId,
      });
    } catch (error) {
      await deleteFromCloudinary(imagePublicId);
      throw error;
    }

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

export const getMyFoods = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const restaurantIds = await Restaurant.find({ owner: req.user!.id })
      .distinct("_id");
    const foods = await Food.find({ restaurant: { $in: restaurantIds } })
      .populate("restaurant")
      .sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(true, "Restaurant foods fetched successfully", foods)
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
    const existing = await assertCanManageFood(req.user!.id, id);

    const updateData: FoodUpdateData = {};
    const stringFields = ["name", "description", "category", "restaurant"] as const;
    stringFields.forEach((field) => {
      if (typeof req.body[field] === "string") updateData[field] = req.body[field].trim();
    });
    if (updateData.restaurant) {
      await assertCanManageRestaurant(req.user!.id, updateData.restaurant);
    }
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.isAvailable !== undefined) {
      updateData.isAvailable =
        req.body.isAvailable === true || req.body.isAvailable === "true";
    }

    let newImagePublicId = "";
    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "foods"
      );
      updateData.image = uploadRes.secure_url;
      updateData.imagePublicId = uploadRes.public_id;
      newImagePublicId = uploadRes.public_id;
    }

    let food;
    try {
      food = await updateFoodService(id, updateData);
    } catch (error) {
      await deleteFromCloudinary(newImagePublicId);
      throw error;
    }

    if (newImagePublicId && existing?.imagePublicId) {
      await deleteFromCloudinary(existing.imagePublicId);
    }

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
    const existing = await assertCanManageFood(req.user!.id, id);

    let imageUrl = existing?.image || "";
    let imagePublicId = existing?.imagePublicId || "";

    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "foods"
      );
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
    }

    let food;
    try {
      food = await updateFoodService(id, {
        image: imageUrl,
        imagePublicId,
      });
    } catch (error) {
      if (imagePublicId !== existing?.imagePublicId) {
        await deleteFromCloudinary(imagePublicId);
      }
      throw error;
    }

    if (
      imagePublicId &&
      existing?.imagePublicId &&
      imagePublicId !== existing.imagePublicId
    ) {
      await deleteFromCloudinary(existing.imagePublicId);
    }

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

    await assertCanManageFood(req.user!.id, id);
    await deleteFoodService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Food deleted successfully"
      )
    );
  }
);
