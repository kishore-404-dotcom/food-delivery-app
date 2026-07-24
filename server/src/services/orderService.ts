import mongoose from "mongoose";

import Cart from "../models/cart";
import Order from "../models/order";
import Address from "../models/address";
import Food from "../models/food";
import Restaurant from "../models/restaurant";

import { ApiError } from "../utils/apiError";
import { calculateOrderTotal } from "../utils/orderTotal";
import { applyCouponService } from "./couponService";

// Place Order
export const placeOrderService = async (
  userId: string,
  paymentMethod: "COD" | "ONLINE",
  deliveryAddress: string,
  couponCode?: string
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
    const restaurantIds = new Set<string>();

    const orderItems = cart.items.map(
      (item: any) => {

        const price = item.food.price;
        restaurantIds.add(item.food.restaurant.toString());

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

    if (restaurantIds.size !== 1) {
      throw new ApiError(
        400,
        "All items in an order must be from the same restaurant"
      );
    }

    const [restaurantId] = Array.from(restaurantIds);

    const couponResult = couponCode
      ? await applyCouponService(couponCode, subtotal)
      : null;
    const { totalAmount, discountAmount } = calculateOrderTotal(
      subtotal,
      couponResult?.discount || 0
    );

    const order = await Order.create(
      [
        {
          user: userId,
          restaurant: restaurantId,
          deliveryAddress,
          items: orderItems,
          totalAmount,
          couponCode: couponResult?.coupon.code,
          discountAmount,
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

export const getRestaurantOrdersService = async (ownerId: string) => {
  const restaurantIds = await Restaurant.find({ owner: ownerId }).distinct("_id");
  const foodIds = await Food.find({
    restaurant: { $in: restaurantIds },
  }).distinct("_id");

  return Order.find({
    $or: [
      { restaurant: { $in: restaurantIds } },
      {
        restaurant: { $exists: false },
        "items.food": { $in: foodIds },
      },
    ],
  })
    .populate("user", "name email phone")
    .populate("deliveryAddress")
    .sort({ createdAt: -1 });
};

export const assertOrderBelongsToRestaurantOwner = async (
  orderId: string,
  ownerId: string
) => {
  const restaurantIds = await Restaurant.find({ owner: ownerId }).distinct("_id");
  const foodIds = await Food.find({
    restaurant: { $in: restaurantIds },
  }).distinct("_id");

  const order = await Order.findOne({
    _id: orderId,
    $or: [
      { restaurant: { $in: restaurantIds } },
      {
        restaurant: { $exists: false },
        "items.food": { $in: foodIds },
      },
    ],
  });

  if (!order) {
    throw new ApiError(403, "You can only manage orders for your restaurant");
  }
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
