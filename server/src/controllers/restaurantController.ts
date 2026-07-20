import { Response } from "express";

import { AuthRequest } from "../middleware/authMiddleware";
import asyncHandler from "../middleware/asyncHandler";

import { ApiResponse } from "../utils/apiResponse";
import uploadToCloudinary from "../utils/uploadToCloudinary";

import {
  createRestaurantService,
  getAllRestaurantsService,
  getRestaurantByIdService,
  updateRestaurantService,
  deleteRestaurantService,
  searchRestaurantsService,
  getRestaurantsByCategoryService,
} from "../services/restaurantService";

// Create restaurant
export const createRestaurant = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "restaurants"
      );
    }

    const restaurant = await createRestaurantService({
      ...req.body,
      image: imageUrl,
      owner: req.user!.id,
    });

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
    const restaurants =
      await getAllRestaurantsService();

    res.status(200).json(
      new ApiResponse(
        true,
        "Restaurants fetched successfully",
        restaurants
      )
    );
  }
);

// Search restaurants by name
export const searchRestaurants = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name = "" } = req.query as {
      name?: string;
    };

    const restaurants =
      await searchRestaurantsService(name);

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
    const { category } = req.params as {
      category: string;
    };

    const restaurants =
      await getRestaurantsByCategoryService(
        category
      );

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
    const { id } = req.params as {
      id: string;
    };

    const restaurant =
      await getRestaurantByIdService(id);

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
    const { id } = req.params as {
      id: string;
    };

    const restaurant =
      await updateRestaurantService(
        id,
        req.body
      );

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
    const { id } = req.params as {
      id: string;
    };

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "restaurants"
      );
    }

    const restaurant =
      await updateRestaurantService(id, {
        image: imageUrl,
      });

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
    const { id } = req.params as {
      id: string;
    };

    await deleteRestaurantService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Restaurant deleted successfully"
      )
    );
  }
);