import api from "./api";
import type { ApiResponse } from "../types/food";

export interface DashboardOverview {
  totalUsers?: number;
  totalOrders?: number;
  totalRevenue?: number;
  totalRestaurants?: number;
  totalFoods?: number;
}

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await api.get<ApiResponse<DashboardOverview>>("/dashboard/overview");
  return response.data.data;
};
