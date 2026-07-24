import api from "./api";
import type { IAddress, ApiResponse } from "../types/food";

export type CreateAddressInput = Omit<IAddress, "_id" | "user" | "createdAt" | "updatedAt">;

export const getMyAddresses = async (): Promise<IAddress[]> => {
  const response = await api.get<ApiResponse<IAddress[]>>("/addresses/my-addresses");
  return response.data.data;
};

export const getAddressById = async (id: string): Promise<IAddress> => {
  const response = await api.get<ApiResponse<IAddress>>(`/addresses/${id}`);
  return response.data.data;
};

export const createAddress = async (data: Partial<CreateAddressInput>): Promise<IAddress> => {
  const response = await api.post<ApiResponse<IAddress>>("/addresses", data);
  return response.data.data;
};

export const updateAddress = async (
  id: string,
  data: Partial<CreateAddressInput>
): Promise<IAddress> => {
  const response = await api.put<ApiResponse<IAddress>>(`/addresses/${id}`, data);
  return response.data.data;
};

export const setDefaultAddress = async (id: string): Promise<IAddress> => {
  const response = await api.patch<ApiResponse<IAddress>>(`/addresses/default/${id}`);
  return response.data.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/addresses/${id}`);
};
