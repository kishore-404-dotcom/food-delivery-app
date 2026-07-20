import Food from "../models/food";
import { ApiError } from "../utils/apiError";

import {
  getCache,
  setCache,
} from "./cacheService";

// Create food
export const createFoodService = async (
  foodData: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    restaurant: string;
  }
) => {
  return await Food.create(foodData);
};

// Get all foods
export const getFoodsService =
  async () => {

    const cachedFoods =
      await getCache("foods");

    if (cachedFoods) {
      return JSON.parse(
        cachedFoods
      );
    }

    const foods =
      await Food.find()
        .populate("restaurant")
        .sort({ createdAt: -1 });

    await setCache(
      "foods",
      foods
    );

    return foods;

};

// Search foods
export const searchFoodsService = async (
  name: string
) => {
  return await Food.find({
    name: {
      $regex: name,
      $options: "i",
    },
  })
    .populate("restaurant")
    .sort({ createdAt: -1 });
};

// Get foods by category
export const getFoodsByCategoryService =
  async (category: string) => {
    return await Food.find({
      category: {
        $regex: category,
        $options: "i",
      },
    })
      .populate("restaurant")
      .sort({ createdAt: -1 });
  };

// Get food by ID
export const getFoodByIdService = async (
  id: string
) => {
  const food = await Food.findById(id)
    .populate("restaurant");

  if (!food) {
    throw new ApiError(
      404,
      "Food not found"
    );
  }

  return food;
};

// Update food
export const updateFoodService = async (
  id: string,
  data: object
) => {
  const food = await Food.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!food) {
    throw new ApiError(
      404,
      "Food not found"
    );
  }

  return food;
};

// Delete food
export const deleteFoodService = async (
  id: string
) => {
  const food =
    await Food.findById(id);

  if (!food) {
    throw new ApiError(
      404,
      "Food not found"
    );
  }

  await food.deleteOne();
};