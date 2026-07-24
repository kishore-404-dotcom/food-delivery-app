import api from "./api";
import type { IUser, ApiResponse } from "../types/food";

export const getUserProfile = async (): Promise<IUser> => {
  const response = await api.get<ApiResponse<IUser>>("/auth/profile");
  return response.data.data;
};
