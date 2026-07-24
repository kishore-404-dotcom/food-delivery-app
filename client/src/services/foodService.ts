import api from "./api";
import type { IFood, ApiResponse } from "../types/food";

export const getFoods = async (): Promise<IFood[]> => {
  const response = await api.get<ApiResponse<IFood[]>>("/foods");
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
