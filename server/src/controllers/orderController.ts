import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";
import logger from "../config/logger";
import {
  emitToAdmins,
  emitToRestaurantOwner,
  emitToUser,
} from "../socket";
import { createInAppNotificationService } from "../services/notificationService";
import Restaurant from "../models/restaurant";
import User from "../models/user";

import {
  placeOrderService,
  getMyOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
  getRestaurantOrdersService,
  assertOrderBelongsToRestaurantOwner,
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
        couponCode?: string;
      }
    >,
    res: Response
  ) => {

    const order =
      await placeOrderService(
        req.user!.id,
        req.body.paymentMethod,
        req.body.deliveryAddress,
        req.body.couponCode
      );

    emitToUser(req.user!.id, "order:created", order);
    emitToAdmins("order:created", order);
    if (order.restaurant) {
      const restaurant = await Restaurant.findById(order.restaurant).select("owner");
      if (restaurant) {
        emitToRestaurantOwner(
          restaurant.owner.toString(),
          "order:created",
          order
        );
      }
    }

    try {
      const notification = await createInAppNotificationService(
        req.user!.id,
        "Order placed",
        `Your order ${order._id.toString()} was placed successfully.`,
        "ORDER"
      );
      emitToUser(req.user!.id, "notification:new", notification);
    } catch (error) {
      logger.error("Failed to create real-time order notification:", error);
    }

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

export const getRestaurantOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orders = await getRestaurantOrdersService(req.user!.id);

    res.status(200).json(
      new ApiResponse(true, "Restaurant orders fetched successfully", orders)
    );
  }
);


// Update order status
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const { id } = req.params as {
      id: string;
    };

    const currentUser = await User.findById(req.user!.id).select("role");
    if (currentUser?.role === "restaurant_owner") {
      await assertOrderBelongsToRestaurantOwner(id, req.user!.id);
    }

    const order = await updateOrderStatusService(
      id,
      req.body.orderStatus
    );

    const userId = order.user.toString();
    emitToUser(userId, "order:status-updated", order);
    emitToAdmins("order:status-updated", order);
    if (order.restaurant) {
      const restaurant = await Restaurant.findById(order.restaurant).select("owner");
      if (restaurant) {
        emitToRestaurantOwner(
          restaurant.owner.toString(),
          "order:status-updated",
          order
        );
      }
    }

    try {
      const notification = await createInAppNotificationService(
        userId,
        "Order status updated",
        `Order ${order._id.toString()} is now ${order.orderStatus.replace(/_/g, " ")}.`,
        order.orderStatus === "DELIVERED" ? "DELIVERY" : "ORDER"
      );
      emitToUser(userId, "notification:new", notification);
    } catch (error) {
      logger.error("Failed to create real-time status notification:", error);
    }

    res.status(200).json(
      new ApiResponse(
        true,
        "Order status updated successfully",
        order
      )
    );

  }
);
