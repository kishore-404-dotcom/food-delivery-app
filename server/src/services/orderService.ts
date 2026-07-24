import mongoose from "mongoose";

import Cart from "../models/cart";
import Order from "../models/order";
import Address from "../models/address";

import { ApiError } from "../utils/apiError";
import { calculateOrderTotal } from "../utils/orderTotal";

// Place Order
export const placeOrderService = async (
  userId: string,
  paymentMethod: "COD" | "ONLINE",
  deliveryAddress: string
) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    // Verify Address
    const address = await Address.findById(
      deliveryAddress
    ).session(session);

    if (!address) {
      throw new ApiError(
        404,
        "Delivery address not found"
      );
    }

    if (address.user.toString() !== userId) {
      throw new ApiError(
        403,
        "Unauthorized address"
      );
    }

    // Get Cart
    const cart = await Cart.findOne({
      user: userId,
    })
      .populate("items.food")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new ApiError(
        400,
        "Cart is empty"
      );
    }

    let subtotal = 0;

    const orderItems = cart.items.map(
      (item: any) => {

        const price = item.food.price;

        subtotal +=
          price * item.quantity;

        return {
          food: item.food._id,
          name: item.food.name,
          price,
          quantity: item.quantity,
        };

      }
    );

    const { totalAmount } = calculateOrderTotal(subtotal);

    const order = await Order.create(
      [
        {
          user: userId,
          deliveryAddress,
          items: orderItems,
          totalAmount,
          paymentMethod,
        },
      ],
      { session }
    );

    // Clear Cart
    cart.items = [];

    await cart.save({
      session,
    });

    await session.commitTransaction();

    return order[0];

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }

};

// Get My Orders
export const getMyOrdersService = async (
  userId: string
) => {

  return await Order.find({
    user: userId,
  })
    .populate("deliveryAddress")
    .sort({
      createdAt: -1,
    });

};

// Get All Orders
export const getAllOrdersService =
  async () => {

    return await Order.find()
      .populate(
        "user",
        "name email"
      )
      .populate("deliveryAddress")
      .sort({
        createdAt: -1,
      });

  };

// Update Order Status
export const updateOrderStatusService = async (
  orderId: string,
  orderStatus: string
) => {

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  const validTransitions: Record<string, string[]> = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PREPARING", "CANCELLED"],
    PREPARING: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (
    !validTransitions[order.orderStatus]?.includes(orderStatus)
  ) {
    throw new ApiError(
      400,
      `Cannot change order status from ${order.orderStatus} to ${orderStatus}`
    );
  }

  order.orderStatus =
    orderStatus as typeof order.orderStatus;

  await order.save();

  return order;
};
