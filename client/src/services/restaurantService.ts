import api from "./api";
import type { IRestaurant, ApiResponse } from "../types/food";

export interface CreateRestaurantInput {
  name: string;
  address: string;
  category?: string;
  description?: string;
  image?: string;
  deliveryTime?: number;
  deliveryFee?: number;
  isOpen?: boolean;
}

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

export const createRestaurant = async (data: CreateRestaurantInput): Promise<IRestaurant> => {
  const response = await api.post<ApiResponse<IRestaurant>>("/restaurants", data);
  return response.data.data;
};

export const updateRestaurant = async (
  id: string,
  data: Partial<CreateRestaurantInput>
): Promise<IRestaurant> => {
  const response = await api.put<ApiResponse<IRestaurant>>(`/restaurants/${id}`, data);
  return response.data.data;
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/restaurants/${id}`);
};
