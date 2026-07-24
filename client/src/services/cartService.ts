import api from "./api";
import type { ICart, ApiResponse } from "../types/food";

export const getCart = async (): Promise<ICart | null> => {
  const response = await api.get<ApiResponse<ICart | null>>("/cart");
  return response.data.data;
};

export const addToCart = async (
  foodId: string,
  quantity: number = 1
): Promise<ICart> => {
  const response = await api.post<ApiResponse<ICart>>("/cart", {
    foodId,
    quantity,
  });
  return response.data.data;
};

export const updateCartQuantity = async (
  foodId: string,
  quantity: number
): Promise<ICart> => {
  const response = await api.put<ApiResponse<ICart>>("/cart", {
    foodId,
    quantity,
  });
  return response.data.data;
};

export const removeFromCart = async (foodId: string): Promise<ICart> => {
  const response = await api.delete<ApiResponse<ICart>>("/cart", {
    data: { foodId },
  });
  return response.data.data;
};

export const clearCart = async (): Promise<void> => {
  await api.delete<ApiResponse<void>>("/cart/clear");
};
