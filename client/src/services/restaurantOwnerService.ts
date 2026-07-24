import api from "./api";
import type { ApiResponse, IUser } from "../types/food";

export const getRestaurantOwners = async (): Promise<IUser[]> => {
  const response = await api.get<ApiResponse<IUser[]>>(
    "/admin/restaurant-owners"
  );
  return response.data.data;
};

export const updateRestaurantOwnerStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<IUser> => {
  const response = await api.patch<ApiResponse<IUser>>(
    `/admin/restaurant-owners/${id}/status`,
    { status }
  );
  return response.data.data;
};
