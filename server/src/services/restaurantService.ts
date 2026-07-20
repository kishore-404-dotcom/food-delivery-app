import Restaurant from "../models/restaurant";
import { ApiError } from "../utils/apiError";

import {
  getCache,
  setCache,
} from "./cacheService";

// Create restaurant
export const createRestaurantService = async (
  restaurantData: {
    name: string;
    description: string;
    address: string;
    image: string;
    category: string;
    deliveryTime: number;
    deliveryFee: number;
    owner: string;
  }
) => {

  return await Restaurant.create(
    restaurantData
  );

};


// Get all restaurants
export const getAllRestaurantsService =
  async () => {

    const cached =
      await getCache(
        "restaurants"
      );

    if (cached) {
      return JSON.parse(
        cached
      );
    }

    const restaurants =
      await Restaurant.find()
        .populate(
          "owner",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    await setCache(
      "restaurants",
      restaurants
    );

    return restaurants;

};


// Get restaurant by ID
export const getRestaurantByIdService =
  async (id: string) => {

    const restaurant =
      await Restaurant.findById(id)
        .populate("owner", "name email");

    if (!restaurant) {
      throw new ApiError(
        404,
        "Restaurant not found"
      );
    }

    return restaurant;

  };


// Update restaurant
export const updateRestaurantService =
  async (
    id: string,
    data: object
  ) => {

    const restaurant =
      await Restaurant.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!restaurant) {
      throw new ApiError(
        404,
        "Restaurant not found"
      );
    }

    return restaurant;

  };


// Delete restaurant
export const deleteRestaurantService =
  async (id: string) => {

    const restaurant =
      await Restaurant.findById(id);

    if (!restaurant) {
      throw new ApiError(
        404,
        "Restaurant not found"
      );
    }

    await restaurant.deleteOne();

  };

  // Search restaurants
export const searchRestaurantsService =
  async (name: string) => {

    return await Restaurant.find({
      name: {
        $regex: name,
        $options: "i",
      },
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

  };


// Get restaurants by category
export const getRestaurantsByCategoryService =
  async (category: string) => {

    return await Restaurant.find({
      category: {
        $regex: category,
        $options: "i",
      },
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

  };