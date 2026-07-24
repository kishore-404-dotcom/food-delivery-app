import api from "./api";
import type { IRestaurant, ApiResponse } from "../types/food";

export const getAllRestaurants = async (): Promise<IRestaurant[]> => {
  const response = await api.get<ApiResponse<IRestaurant[]>>("/restaurants");
  return response.data.data;
};

export const searchRestaurants = async (name: string): Promise<IRestaurant[]> => {
  const response = await api.get<ApiResponse<IRestaurant[]>>("/restaurants/search", {
    params: { name },
  });
  return response.data.data;
};

export const getRestaurantsByCategory = async (category: string): Promise<IRestaurant[]> => {
  const response = await api.get<ApiResponse<IRestaurant[]>>(
    `/restaurants/category/${encodeURIComponent(category)}`
  );
  return response.data.data;
};

export const getRestaurantById = async (id: string): Promise<IRestaurant> => {
  const response = await api.get<ApiResponse<IRestaurant>>(`/restaurants/${id}`);
  return response.data.data;
};
