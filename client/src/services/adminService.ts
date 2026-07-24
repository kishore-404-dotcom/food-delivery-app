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

export const getDashboardStats = async (): Promise<any> => {
  const response = await api.get<ApiResponse<any>>("/dashboard/stats");
  return response.data.data;
};

export const getRevenueAnalytics = async (): Promise<any> => {
  const response = await api.get<ApiResponse<any>>("/dashboard/revenue");
  return response.data.data;
};

export const getRecentOrders = async (): Promise<any> => {
  const response = await api.get<ApiResponse<any>>("/dashboard/recent-orders");
  return response.data.data;
};

export const getTopFoods = async (): Promise<any> => {
  const response = await api.get<ApiResponse<any>>("/dashboard/top-foods");
  return response.data.data;
};

export const getUserGrowth = async (): Promise<any> => {
  const response = await api.get<ApiResponse<any>>("/dashboard/user-growth");
  return response.data.data;
};
