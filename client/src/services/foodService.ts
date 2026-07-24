import api from "./api";
import type { IFood, ApiResponse } from "../types/food";

export interface CreateFoodInput {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  restaurant: string;
  isAvailable?: boolean;
}

export const getFoods = async (): Promise<IFood[]> => {
  const response = await api.get<ApiResponse<IFood[]>>("/foods");
  return response.data.data;
};

export const getMyFoods = async (): Promise<IFood[]> => {
  const response = await api.get<ApiResponse<IFood[]>>("/foods/mine");
  return response.data.data;
};

export const searchFoods = async (name: string): Promise<IFood[]> => {
  const response = await api.get<ApiResponse<IFood[]>>("/foods/search", {
    params: { name },
  });
  return response.data.data;
};

export const getFoodsByCategory = async (category: string): Promise<IFood[]> => {
  const response = await api.get<ApiResponse<IFood[]>>(
    `/foods/category/${encodeURIComponent(category)}`
  );
  return response.data.data;
};

export const getFoodById = async (id: string): Promise<IFood> => {
  const response = await api.get<ApiResponse<IFood>>(`/foods/${id}`);
  return response.data.data;
};

export const createFood = async (
  data: CreateFoodInput | FormData
): Promise<IFood> => {
  const response = await api.post<ApiResponse<IFood>>("/foods", data);
  return response.data.data;
};

export const updateFood = async (
  id: string,
  data: Partial<CreateFoodInput> | FormData
): Promise<IFood> => {
  const response = await api.put<ApiResponse<IFood>>(`/foods/${id}`, data);
  return response.data.data;
};

export const deleteFood = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/foods/${id}`);
};
