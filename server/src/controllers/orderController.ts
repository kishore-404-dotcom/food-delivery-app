import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  placeOrderService,
  getMyOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
} from "../services/orderService";

// Place Order
export const placeOrder = asyncHandler(
  async (
    req: AuthRequest<
      {},
      any,
      {
        paymentMethod: "COD" | "ONLINE";
        deliveryAddress: string;
      }
    >,
    res: Response
  ) => {

    const order =
      await placeOrderService(
        req.user!.id,
        req.body.paymentMethod,
        req.body.deliveryAddress
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Order placed successfully",
        order
      )
    );

  }
);

// Get my orders
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const orders = await getMyOrdersService(
      req.user!.id
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Orders fetched successfully",
        orders
      )
    );

  }
);


// Get all orders
export const getAllOrders = asyncHandler(
  async (_req: AuthRequest, res: Response) => {

    const orders = await getAllOrdersService();

    res.status(200).json(
      new ApiResponse(
        true,
        "Orders fetched successfully",
        orders
      )
    );

  }
);


// Update order status
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const { id } = req.params as {
      id: string;
    };

    const order = await updateOrderStatusService(
      id,
      req.body.orderStatus
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Order status updated successfully",
        order
      )
    );

  }
);