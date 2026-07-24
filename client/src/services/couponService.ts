import api from "./api";
import type { ICoupon, ApiResponse } from "../types/food";

export interface ApplyCouponResponse {
  coupon: ICoupon;
  discount: number;
  finalAmount: number;
}

export const getCoupons = async (): Promise<ICoupon[]> => {
  const response = await api.get<ApiResponse<ICoupon[]>>("/coupons");
  return response.data.data;
};

export const getCouponByCode = async (code: string): Promise<ICoupon> => {
  const response = await api.get<ApiResponse<ICoupon>>(`/coupons/${encodeURIComponent(code)}`);
  return response.data.data;
};

export const applyCoupon = async (
  code: string,
  totalAmount: number
): Promise<ApplyCouponResponse> => {
  const response = await api.post<ApiResponse<ApplyCouponResponse>>("/coupons/apply", {
    code: code.trim().toUpperCase(),
    totalAmount,
  });
  return response.data.data;
};
