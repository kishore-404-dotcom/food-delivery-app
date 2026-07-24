import Food from "../models/food";
import Restaurant from "../models/restaurant";
import User from "../models/user";
import { ApiError } from "./apiError";

export const assertCanManageRestaurant = async (
  userId: string,
  restaurantId: string
) => {
  const [user, restaurant] = await Promise.all([
    User.findById(userId).select("role restaurantStatus"),
    Restaurant.findById(restaurantId),
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  if (
    user.role !== "admin" &&
    restaurant.owner.toString() !== userId
  ) {
    throw new ApiError(403, "You can only manage your own restaurant");
  }

  return restaurant;
};

export const assertCanManageFood = async (
  userId: string,
  foodId: string
) => {
  const food = await Food.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  await assertCanManageRestaurant(userId, food.restaurant.toString());
  return food;
};
