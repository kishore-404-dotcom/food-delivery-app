import api from "./api";
import type { IUser, ApiResponse } from "../types/food";

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const getUserProfile = async (): Promise<IUser> => {
  const response = await api.get<ApiResponse<IUser>>("/auth/profile");
  return response.data.data;
};

export const updateUserProfile = async (
  data: UpdateProfileInput
): Promise<IUser> => {
  const response = await api.put<ApiResponse<IUser>>("/auth/profile", data);
  return response.data.data;
};

export const changePassword = async (
  data: ChangePasswordInput
): Promise<void> => {
  await api.put<ApiResponse<void>>("/auth/change-password", data);
};

export const requestPasswordReset = async (email: string): Promise<string> => {
  const response = await api.post<ApiResponse<void>>("/auth/forgot-password", {
    email,
  });
  return response.data.message;
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<string> => {
  const response = await api.post<ApiResponse<void>>("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data.message;
};
