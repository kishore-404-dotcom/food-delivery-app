import mongoose from "mongoose";

import Order from "../models/order";
import Payment, { IPayment } from "../models/payment";
import User from "../models/user";
import { RAZORPAY_KEY_ID } from "../config/env";
import { RazorpayPaymentProvider } from "../providers/paymentProvider";
import { ApiError } from "../utils/apiError";
import { verifyRazorpaySignature } from "../utils/razorpaySignature";

export interface RazorpayCheckoutPayload {
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

export interface RazorpayVerificationInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

const assertPayableOrder = (
  order: {
    paymentMethod: "COD" | "ONLINE";
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    orderStatus: string;
  }
) => {
  if (order.paymentMethod !== "ONLINE") {
    throw new ApiError(400, "Razorpay is only available for online orders");
  }
  if (order.paymentStatus === "PAID") {
    throw new ApiError(409, "Order has already been paid");
  }
  if (["CANCELLED", "DELIVERED"].includes(order.orderStatus)) {
    throw new ApiError(410, "Order is no longer eligible for payment");
  }
};

const buildCheckoutPayload = (
  payment: IPayment,
  user: { name: string; email: string; phone: string }
): RazorpayCheckoutPayload => {
  if (!payment.razorpayOrderId) {
    throw new ApiError(500, "Razorpay order reference is missing");
  }

  return {
    keyId: RAZORPAY_KEY_ID,
    razorpayOrderId: payment.razorpayOrderId,
    amount: Math.round(payment.amount * 100),
    currency: payment.currency,
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone,
    },
  };
};

export const createPaymentService = async (
  userId: string,
  orderId: string
): Promise<RazorpayCheckoutPayload> => {
  const [order, user] = await Promise.all([
    Order.findById(orderId),
    User.findById(userId),
  ]);

  if (!order) throw new ApiError(404, "Order not found");
  if (!user) throw new ApiError(404, "User not found");
  if (order.user.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to access this order");
  }

  assertPayableOrder(order);

  const existingPayment = await Payment.findOne({ order: orderId }).sort({
    createdAt: -1,
  });

  if (existingPayment?.status === "SUCCESS") {
    throw new ApiError(409, "Order has already been paid");
  }

  // Reuse an open gateway order so network retries do not create duplicate attempts.
  if (
    existingPayment?.status === "PENDING" &&
    existingPayment.paymentMethod === "RAZORPAY" &&
    existingPayment.razorpayOrderId
  ) {
    return buildCheckoutPayload(existingPayment, user);
  }

  const amountInPaise = Math.round(order.totalAmount * 100);
  if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
    throw new ApiError(400, "Order total is not payable");
  }

  const provider = new RazorpayPaymentProvider();
  const providerOrder = await provider.createOrder(
    amountInPaise,
    `order_${order._id.toString()}`.slice(0, 40),
    { orderId: order._id.toString(), userId }
  );
  if (
    providerOrder.amount !== amountInPaise ||
    providerOrder.currency !== "INR"
  ) {
    throw new ApiError(502, "Razorpay returned an unexpected order amount");
  }

  let payment: IPayment;
  if (existingPayment) {
    existingPayment.amount = order.totalAmount;
    existingPayment.currency = providerOrder.currency;
    existingPayment.paymentId = providerOrder.id;
    existingPayment.razorpayOrderId = providerOrder.id;
    existingPayment.razorpayPaymentId = undefined;
    existingPayment.paymentMethod = "RAZORPAY";
    existingPayment.status = "PENDING";
    existingPayment.failureReason = undefined;
    existingPayment.verifiedAt = undefined;
    payment = await existingPayment.save();
  } else {
    payment = await Payment.create({
      user: userId,
      order: order._id,
      amount: order.totalAmount,
      currency: providerOrder.currency,
      paymentId: providerOrder.id,
      razorpayOrderId: providerOrder.id,
      paymentMethod: "RAZORPAY",
      status: "PENDING",
    });
  }

  if (order.paymentStatus === "FAILED") {
    order.paymentStatus = "PENDING";
    await order.save();
  }

  return buildCheckoutPayload(payment, user);
};

export const verifyPaymentService = async (
  userId: string,
  input: RazorpayVerificationInput
): Promise<IPayment> => {
  const payment = await Payment.findOne({
    razorpayOrderId: input.razorpayOrderId,
    user: userId,
  });

  if (!payment) throw new ApiError(404, "Payment attempt not found");

  if (
    !verifyRazorpaySignature(
      input.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature
    )
  ) {
    throw new ApiError(400, "Razorpay signature verification failed");
  }

  if (payment.status === "SUCCESS") {
    if (payment.razorpayPaymentId !== input.razorpayPaymentId) {
      throw new ApiError(409, "Order was verified with a different payment");
    }
    return payment;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sessionPayment = await Payment.findById(payment._id).session(session);
    if (!sessionPayment) throw new ApiError(404, "Payment attempt not found");

    const order = await Order.findById(sessionPayment.order).session(session);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.user.toString() !== userId) {
      throw new ApiError(403, "Unauthorized payment verification");
    }
    if (order.paymentStatus === "PAID" && sessionPayment.status !== "SUCCESS") {
      throw new ApiError(409, "Order has already been paid");
    }
    if (["CANCELLED", "DELIVERED"].includes(order.orderStatus)) {
      throw new ApiError(410, "Order is no longer eligible for payment");
    }

    sessionPayment.razorpayPaymentId = input.razorpayPaymentId;
    sessionPayment.paymentId = input.razorpayPaymentId;
    sessionPayment.status = "SUCCESS";
    sessionPayment.failureReason = undefined;
    sessionPayment.verifiedAt = new Date();
    await sessionPayment.save({ session });

    order.paymentStatus = "PAID";
    if (order.orderStatus === "PLACED") order.orderStatus = "CONFIRMED";
    await order.save({ session });

    await session.commitTransaction();
    return sessionPayment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const paymentFailedService = async (
  userId: string,
  razorpayOrderId: string,
  reason: string,
  abandoned: boolean
): Promise<IPayment> => {
  const payment = await Payment.findOne({
    razorpayOrderId,
    user: userId,
  });

  if (!payment) throw new ApiError(404, "Payment attempt not found");
  if (payment.status === "SUCCESS") {
    throw new ApiError(409, "A successful payment cannot be marked as failed");
  }

  payment.status = abandoned ? "ABANDONED" : "FAILED";
  payment.failureReason = reason.slice(0, 500);
  await payment.save();

  await Order.updateOne(
    { _id: payment.order, user: userId, paymentStatus: { $ne: "PAID" } },
    { $set: { paymentStatus: "FAILED" } }
  );

  return payment;
};

export const getMyPaymentsService = async (userId: string) =>
  Payment.find({ user: userId }).populate("order").sort({ createdAt: -1 });

export const getPaymentByIdService = async (
  paymentId: string,
  userId: string
) => {
  const payment = await Payment.findById(paymentId).populate("order");
  if (!payment) throw new ApiError(404, "Payment not found");
  if (payment.user.toString() !== userId) {
    throw new ApiError(403, "Unauthorized access");
  }
  return payment;
};

export const getAllPaymentsService = async (
  page: number,
  limit: number,
  sort: string = "-createdAt",
  status?: string,
  paymentMethod?: string,
  search?: string
) => {
  const filter: {
    status?: IPayment["status"];
    paymentMethod?: IPayment["paymentMethod"];
    $or?: Array<Record<string, { $regex: string; $options: string }>>;
  } = {};
  if (status) filter.status = status as IPayment["status"];
  if (paymentMethod) filter.paymentMethod = paymentMethod as IPayment["paymentMethod"];
  if (search) {
    filter.$or = [
      { paymentId: { $regex: search, $options: "i" } },
      { razorpayOrderId: { $regex: search, $options: "i" } },
      { razorpayPaymentId: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate("user", "name email")
      .populate("order")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(filter),
  ]);

  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    payments,
  };
};
