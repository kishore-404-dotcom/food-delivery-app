import api from "./api";
import type { IPayment, ApiResponse } from "../types/food";

export interface RazorpayCheckoutData {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface VerifyRazorpayPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const createPayment = async (
  orderId: string
): Promise<RazorpayCheckoutData> => {
  const response = await api.post<ApiResponse<RazorpayCheckoutData>>(
    "/payments/create",
    { orderId }
  );
  return response.data.data;
};

export const verifyPayment = async (
  data: VerifyRazorpayPaymentInput
): Promise<IPayment> => {
  const response = await api.post<ApiResponse<IPayment>>(
    "/payments/verify",
    data
  );
  return response.data.data;
};

export const reportPaymentFailure = async (
  razorpayOrderId: string,
  reason: string,
  abandoned = false
): Promise<IPayment> => {
  const response = await api.post<ApiResponse<IPayment>>("/payments/failure", {
    razorpayOrderId,
    reason,
    abandoned,
  });
  return response.data.data;
};

export const getMyPayments = async (): Promise<IPayment[]> => {
  const response = await api.get<ApiResponse<IPayment[]>>("/payments/my-payments");
  return response.data.data;
};

export const getPaymentById = async (id: string): Promise<IPayment> => {
  const response = await api.get<ApiResponse<IPayment>>(`/payments/${id}`);
  return response.data.data;
};

export const getAllPayments = async (): Promise<IPayment[]> => {
  const response = await api.get<ApiResponse<IPayment[]>>("/payments");
  return response.data.data;
};
