import api from "./api";
import type { ApiResponse } from "../types/food";

export interface INotificationItem {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: "ORDER" | "DELIVERY" | "PAYMENT" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getMyNotifications = async (): Promise<INotificationItem[]> => {
  const response = await api.get<ApiResponse<INotificationItem[]>>("/notifications");
  return response.data.data;
};

export const markAsRead = async (id: string): Promise<INotificationItem> => {
  const response = await api.put<ApiResponse<INotificationItem>>(
    `/notifications/${id}/read`
  );
  return response.data.data;
};

export const markAllAsRead = async (): Promise<void> => {
  await api.put<ApiResponse<void>>("/notifications/read-all");
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/notifications/${id}`);
};

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
