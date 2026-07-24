import Cart from "../models/cart";
import Food from "../models/food";
import { ApiError } from "../utils/apiError";

// Add item to cart
export const addToCartService = async (
  userId: string,
  foodId: string,
  quantity: number
) => {
  const food = await Food.findById(foodId).select("restaurant isAvailable");
  if (!food || !food.isAvailable) {
    throw new ApiError(400, "Food item is unavailable");
  }

  let cart = await Cart.findOne({ user: userId });

  // Create cart if it doesn't exist
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  if (cart.items.length > 0) {
    const firstCartFood = await Food.findById(cart.items[0].food).select(
      "restaurant"
    );
    if (
      firstCartFood &&
      firstCartFood.restaurant.toString() !== food.restaurant.toString()
    ) {
      throw new ApiError(
        400,
        "Your cart already contains items from another restaurant. Clear it before adding this item."
      );
    }
  }

  // Check if item already exists
  const existingItem = cart.items.find(
    (item) => item.food.toString() === foodId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      food: foodId as any,
      quantity,
    });
  }

  await cart.save();

  return cart.populate("items.food");
};

// Get cart
export const getCartService = async (
  userId: string
) => {
  return await Cart.findOne({
    user: userId,
  }).populate("items.food");
};

// Update quantity
export const updateCartService = async (
  userId: string,
  foodId: string,
  quantity: number
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find(
    (i) => i.food.toString() === foodId
  );

  if (!item) {
    throw new ApiError(404, "Food not found in cart");
  }

  item.quantity = quantity;

  await cart.save();

  return cart.populate("items.food");
};

// Remove item
export const removeFromCartService = async (
  userId: string,
  foodId: string
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.food.toString() !== foodId
  );

  await cart.save();

  return cart.populate("items.food");
};

// Clear cart
export const clearCartService = async (
  userId: string
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = [];

  await cart.save();
};
