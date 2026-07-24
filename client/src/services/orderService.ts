import api from "./api";
import type { IOrder, ApiResponse } from "../types/food";

export interface PlaceOrderInput {
  paymentMethod: "COD" | "ONLINE";
  deliveryAddress: string;
  couponCode?: string;
}

export const placeOrder = async (data: PlaceOrderInput): Promise<IOrder> => {
  const response = await api.post<ApiResponse<IOrder>>("/orders", data);
  return response.data.data;
};

export const getMyOrders = async (): Promise<IOrder[]> => {
  const response = await api.get<ApiResponse<IOrder[]>>("/orders/my-orders");
  return response.data.data;
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  const response = await api.get<ApiResponse<IOrder[]>>("/orders");
  return response.data.data;
};

export const updateOrderStatus = async (
  id: string,
  orderStatus: string
): Promise<IOrder> => {
  const response = await api.put<ApiResponse<IOrder>>(`/orders/${id}`, {
    orderStatus,
  });
  return response.data.data;
};
