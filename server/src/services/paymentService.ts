import mongoose from "mongoose";

import Cart from "../models/cart";
import Order from "../models/order";
import Payment from "../models/payment";

import { ApiError } from "../utils/apiError";

import {
  DummyPaymentProvider,
} from "../providers/paymentProvider";

const paymentProvider =
  new DummyPaymentProvider();

// Create Payment
export const createPaymentService = async (
  userId: string,
  orderId: string
) => {

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== userId) {
    throw new ApiError(
      403,
      "You are not authorized to access this order"
    );
  }

  if (order.paymentStatus === "PAID") {
    throw new ApiError(
      400,
      "Order has already been paid"
    );
  }

  const existingPayment = await Payment.findOne({
    order: orderId,
  });

  if (existingPayment) {
    throw new ApiError(
      400,
      "Payment already exists for this order"
    );
  }

  const providerPayment =
    (await paymentProvider.createPayment(
      order.totalAmount
    )) as {
      paymentId: string;
      paymentMethod: "DUMMY" | "RAZORPAY";
    };

  const payment = await Payment.create({
    user: userId,
    order: order._id,
    amount: order.totalAmount,
    paymentId:
      providerPayment.paymentId,
    paymentMethod:
      providerPayment.paymentMethod,
    status: "PENDING",
  });

  return payment;
};

// Get My Payments
export const getMyPaymentsService = async (
  userId: string
) => {

  return await Payment.find({
    user: userId,
  })
    .populate("order")
    .sort({
      createdAt: -1,
    });

};

// Get Payment By ID
export const getPaymentByIdService = async (
  paymentId: string,
  userId: string
) => {

  const payment = await Payment.findById(
    paymentId
  ).populate("order");

  if (!payment) {
    throw new ApiError(
      404,
      "Payment not found"
    );
  }

  if (payment.user.toString() !== userId) {
    throw new ApiError(
      403,
      "Unauthorized access"
    );
  }

  return payment;

};

// Payment Success
export const paymentSuccessService = async (
  paymentId: string
) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    const payment = await Payment.findById(
      paymentId
    ).session(session);

    if (!payment) {
      throw new ApiError(
        404,
        "Payment not found"
      );
    }

    if (payment.status === "SUCCESS") {
      throw new ApiError(
        400,
        "Payment already completed"
      );
    }

    payment.status = "SUCCESS";

    await payment.save({
      session,
    });

    const order = await Order.findById(
      payment.order
    ).session(session);

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";

    await order.save({
      session,
    });

    const cart = await Cart.findOne({
      user: payment.user,
    }).session(session);

    if (cart) {
      cart.items = [];

      await cart.save({
        session,
      });
    }

    await session.commitTransaction();

    return payment;

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }

};

// Payment Failed
export const paymentFailedService = async (
  paymentId: string
) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    const payment = await Payment.findById(
      paymentId
    ).session(session);

    if (!payment) {
      throw new ApiError(
        404,
        "Payment not found"
      );
    }

    if (payment.status === "FAILED") {
      throw new ApiError(
        400,
        "Payment already failed"
      );
    }

    payment.status = "FAILED";

    await payment.save({
      session,
    });

    const order = await Order.findById(
      payment.order
    ).session(session);

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    order.paymentStatus = "FAILED";
    order.orderStatus = "CANCELLED";

    await order.save({
      session,
    });

    await session.commitTransaction();

    return payment;

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }

};

// Get All Payments
export const getAllPaymentsService = async (
  page: number,
  limit: number,
  sort: string = "-createdAt",
  status?: string,
  paymentMethod?: string,
  search?: string
) => {

  const filter: any = {};

  if (status) {
    filter.status = status;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  if (search) {
    filter.paymentId = {
      $regex: search,
      $options: "i",
    };
  }

  const skip =
    (page - 1) * limit;

  const payments =
    await Payment.find(filter)
      .populate(
        "user",
        "name email"
      )
      .populate("order")
      .sort(sort)
      .skip(skip)
      .limit(limit);

  const total =
    await Payment.countDocuments(
      filter
    );

  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(
      total / limit
    ),
    payments,
  };

};