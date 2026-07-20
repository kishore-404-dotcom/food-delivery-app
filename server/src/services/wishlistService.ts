import Wishlist from "../models/wishlist";
import Cart from "../models/cart";
import { ApiError } from "../utils/apiError";



export const addToWishlistService =
  async (
    userId: string,
    foodId: string
  ) => {

    let wishlist =
      await Wishlist.findOne({
        user: userId,
      });

    if (!wishlist) {

      wishlist =
        await Wishlist.create({
          user: userId,
          items: [],
        });

    }

    const exists =
      wishlist.items.find(
        (item) =>
          item.food.toString() ===
          foodId
      );

    if (exists) {
      throw new ApiError(
        400,
        "Food already exists in wishlist"
      );
    }

    wishlist.items.push({
      food: foodId as any,
    });

    await wishlist.save();

    return wishlist;
};



export const getWishlistService =
  async (userId: string) => {

    return await Wishlist.findOne({
      user: userId,
    }).populate("items.food");

};



export const removeFromWishlistService =
  async (
    userId: string,
    foodId: string
  ) => {

    const wishlist =
      await Wishlist.findOne({
        user: userId,
      });

    if (!wishlist) {
      throw new ApiError(
        404,
        "Wishlist not found"
      );
    }

    wishlist.items =
      wishlist.items.filter(
        (item) =>
          item.food.toString() !==
          foodId
      );

    await wishlist.save();

    return wishlist;
};



export const clearWishlistService =
  async (userId: string) => {

    const wishlist =
      await Wishlist.findOne({
        user: userId,
      });

    if (wishlist) {

      wishlist.items = [];

      await wishlist.save();

    }

};



export const isWishlistedService =
  async (
    userId: string,
    foodId: string
  ) => {

    const wishlist =
      await Wishlist.findOne({
        user: userId,
      });

    if (!wishlist) return false;

    return wishlist.items.some(
      (item) =>
        item.food.toString() ===
        foodId
    );
};



export const moveToCartService =
  async (
    userId: string,
    foodId: string
  ) => {

    let cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {

      cart =
        await Cart.create({
          user: userId,
          items: [],
        });

    }

    const exists =
      cart.items.find(
        (item) =>
          item.food.toString() ===
          foodId
      );

    if (!exists) {

      cart.items.push({
        food: foodId as any,
        quantity: 1,
      });

      await cart.save();

    }

    await removeFromWishlistService(
      userId,
      foodId
    );

    return cart;
};