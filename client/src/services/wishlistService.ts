import api from "./api";
import type { IWishlist, ICart, ApiResponse } from "../types/food";

export const getWishlist = async (): Promise<IWishlist | null> => {
  const response = await api.get<ApiResponse<IWishlist | null>>("/wishlist");
  return response.data.data;
};

export const addToWishlist = async (foodId: string): Promise<IWishlist> => {
  const response = await api.post<ApiResponse<IWishlist>>("/wishlist", { foodId });
  return response.data.data;
};

export const removeFromWishlist = async (foodId: string): Promise<IWishlist> => {
  const response = await api.delete<ApiResponse<IWishlist>>("/wishlist", {
    data: { foodId },
  });
  return response.data.data;
};

export const clearWishlist = async (): Promise<void> => {
  await api.delete<ApiResponse<void>>("/wishlist/clear");
};

export const checkWishlist = async (
  foodId: string
): Promise<{ isWishlisted: boolean }> => {
  const response = await api.get<ApiResponse<{ isWishlisted: boolean }>>(
    `/wishlist/check/${foodId}`
  );
  return response.data.data;
};

export const moveToCart = async (foodId: string): Promise<ICart> => {
  const response = await api.post<ApiResponse<ICart>>("/wishlist/move-to-cart", {
    foodId,
  });
  return response.data.data;
};
