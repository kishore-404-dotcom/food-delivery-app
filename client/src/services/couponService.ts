import api from "./api";
import type { ICoupon, ApiResponse } from "../types/food";

export interface ApplyCouponResponse {
  coupon: ICoupon;
  discount: number;
  finalAmount: number;
}

export interface CreateCouponInput {
  code: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  minOrderAmount: number;
  expiryDate: Date;
  isActive?: boolean;
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

export const createCoupon = async (data: CreateCouponInput): Promise<ICoupon> => {
  const response = await api.post<ApiResponse<ICoupon>>("/coupons", data);
  return response.data.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/coupons/${id}`);
};
