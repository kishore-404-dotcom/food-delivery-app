import api from "./api";
import type { IPayment, ApiResponse } from "../types/food";

export interface CreatePaymentResponse {
  _id: string;
  user: string;
  order: string;
  amount: number;
  paymentId: string;
  paymentMethod: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export const createPayment = async (orderId: string): Promise<IPayment> => {
  const response = await api.post<ApiResponse<IPayment>>("/payments/create", {
    orderId,
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

export const markPaymentSuccess = async (paymentId: string): Promise<IPayment> => {
  const response = await api.put<ApiResponse<IPayment>>(`/payments/success/${paymentId}`);
  return response.data.data;
};

export const markPaymentFailed = async (paymentId: string): Promise<IPayment> => {
  const response = await api.put<ApiResponse<IPayment>>(`/payments/failed/${paymentId}`);
  return response.data.data;
};

export const getAllPayments = async (): Promise<IPayment[]> => {
  const response = await api.get<ApiResponse<IPayment[]>>("/payments");
  return response.data.data;
};
