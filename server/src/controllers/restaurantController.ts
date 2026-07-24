import { Response } from "express";

import { AuthRequest } from "../middleware/authMiddleware";
import asyncHandler from "../middleware/asyncHandler";

import { ApiResponse } from "../utils/apiResponse";
import Restaurant from "../models/restaurant";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadToCloudinary";
import User from "../models/user";
import { ApiError } from "../utils/apiError";
import { assertCanManageRestaurant } from "../utils/restaurantOwnership";

import {
  createRestaurantService,
  getAllRestaurantsService,
  getRestaurantByIdService,
  updateRestaurantService,
  deleteRestaurantService,
  searchRestaurantsService,
  getRestaurantsByCategoryService,
} from "../services/restaurantService";

interface RestaurantUpdateData {
  name?: string;
  description?: string;
  address?: string;
  category?: string;
  deliveryTime?: number;
  deliveryFee?: number;
  isOpen?: boolean;
  image?: string;
  imagePublicId?: string;
}

// Create restaurant
export const createRestaurant = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const currentUser = await User.findById(req.user!.id).select("role");
    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }
    if (
      currentUser.role === "restaurant_owner" &&
      (await Restaurant.exists({ owner: req.user!.id }))
    ) {
      throw new ApiError(409, "A restaurant owner can manage only one restaurant");
    }
    let imageUrl = "";
    let imagePublicId = "";

    // Upload image to Cloudinary
    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "restaurants"
      );
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    let restaurant;
    try {
      restaurant = await createRestaurantService({
        name: req.body.name,
        description: req.body.description || req.body.name,
        address: req.body.address,
        category: req.body.category || "General",
        deliveryTime: req.body.deliveryTime ? Number(req.body.deliveryTime) : 30,
        deliveryFee: req.body.deliveryFee ? Number(req.body.deliveryFee) : 0,
        image: imageUrl,
        imagePublicId,
        owner: req.user!.id,
      });
    } catch (error) {
      await deleteFromCloudinary(imagePublicId);
      throw error;
    }

    res.status(201).json(
      new ApiResponse(
        true,
        "Restaurant created successfully",
        restaurant
      )
    );
  }
);

// Get all restaurants
export const getAllRestaurants = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const restaurants = await getAllRestaurantsService();

    res.status(200).json(
      new ApiResponse(
        true,
        "Restaurants fetched successfully",
        restaurants
      )
    );
  }
);

export const getMyRestaurant = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const restaurant = await Restaurant.findOne({ owner: req.user!.id })
      .populate("owner", "name email");

    res.status(200).json(
      new ApiResponse(true, "Restaurant fetched successfully", restaurant)
    );
  }
);

// Search restaurants by name
export const searchRestaurants = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name = "" } = req.query as { name?: string };

    const restaurants = await searchRestaurantsService(name);

    res.status(200).json(
      new ApiResponse(
        true,
        "Restaurants fetched successfully",
        restaurants
      )
    );
  }
);

// Get restaurants by category
export const getRestaurantsByCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { category } = req.params as { category: string };

    const restaurants = await getRestaurantsByCategoryService(category);

    res.status(200).json(
      new ApiResponse(
        true,
        "Restaurants fetched successfully",
        restaurants
      )
    );
  }
);

// Get restaurant by ID
export const getRestaurantById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const restaurant = await getRestaurantByIdService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Restaurant fetched successfully",
        restaurant
      )
    );
  }
);

// Update restaurant
export const updateRestaurant = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const existing = await assertCanManageRestaurant(req.user!.id, id);

    const updateData: RestaurantUpdateData = {};
    const stringFields = ["name", "description", "address", "category"] as const;
    stringFields.forEach((field) => {
      if (typeof req.body[field] === "string") updateData[field] = req.body[field].trim();
    });
    if (req.body.deliveryTime !== undefined) {
      updateData.deliveryTime = Number(req.body.deliveryTime);
    }
    if (req.body.deliveryFee !== undefined) {
      updateData.deliveryFee = Number(req.body.deliveryFee);
    }
    if (req.body.isOpen !== undefined) {
      updateData.isOpen = req.body.isOpen === true || req.body.isOpen === "true";
    }

    let newImagePublicId = "";
    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "restaurants"
      );
      updateData.image = uploadRes.secure_url;
      updateData.imagePublicId = uploadRes.public_id;
      newImagePublicId = uploadRes.public_id;
    }

    let restaurant;
    try {
      restaurant = await updateRestaurantService(id, updateData);
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
        "Restaurant updated successfully",
        restaurant
      )
    );
  }
);

// Update restaurant image
export const updateRestaurantImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const existing = await assertCanManageRestaurant(req.user!.id, id);

    let imageUrl = existing?.image || "";
    let imagePublicId = existing?.imagePublicId || "";

    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        "restaurants"
      );
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
    }

    let restaurant;
    try {
      restaurant = await updateRestaurantService(id, {
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
        "Restaurant image updated successfully",
        restaurant
      )
    );
  }
);

// Delete restaurant
export const deleteRestaurant = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };

    await assertCanManageRestaurant(req.user!.id, id);
    await deleteRestaurantService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Restaurant deleted successfully"
      )
    );
  }
);
