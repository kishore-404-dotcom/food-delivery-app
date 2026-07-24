import api from "./api";
import type { ApiResponse } from "../types/food";

export const sendWelcomeNotification = async (
  email: string,
  name: string
): Promise<void> => {
  await api.post<ApiResponse<void>>("/notifications/welcome", { email, name });
};

export const sendForgotPasswordNotification = async (
  email: string,
  link: string
): Promise<void> => {
  await api.post<ApiResponse<void>>("/notifications/forgot-password", {
    email,
    link,
  });
};

export const sendOrderPlacedNotification = async (
  email: string,
  orderId: string
): Promise<void> => {
  await api.post<ApiResponse<void>>("/notifications/order", { email, orderId });
};

export const sendDeliveredNotification = async (
  email: string,
  orderId: string
): Promise<void> => {
  await api.post<ApiResponse<void>>("/notifications/delivered", {
    email,
    orderId,
  });
};

export const sendPaymentNotification = async (
  email: string,
  amount: number
): Promise<void> => {
  await api.post<ApiResponse<void>>("/notifications/payment", { email, amount });
};

export const sendRefundNotification = async (
  email: string,
  amount: number
): Promise<void> => {
  await api.post<ApiResponse<void>>("/notifications/refund", { email, amount });
};
