import { sendMailService } from "./emailService";
import Notification from "../models/notification";

import {
  welcomeTemplate,
  forgotPasswordTemplate,
} from "../templates/authTemplates";

import {
  orderPlacedTemplate,
  deliveredTemplate,
} from "../templates/orderTemplates";

import {
  paymentSuccessTemplate,
  refundTemplate,
} from "../templates/paymentTemplates";

// Email Notifications
export const sendWelcomeEmail = async (email: string, name: string) => {
  await sendMailService(email, "Welcome", welcomeTemplate(name));
};

export const sendForgotPasswordEmail = async (email: string, link: string) => {
  await sendMailService(email, "Reset Password", forgotPasswordTemplate(link));
};

export const sendOrderPlacedEmail = async (email: string, orderId: string) => {
  await sendMailService(email, "Order Placed", orderPlacedTemplate(orderId));
};

export const sendDeliveredEmail = async (email: string, orderId: string) => {
  await sendMailService(email, "Order Delivered", deliveredTemplate(orderId));
};

export const sendPaymentSuccessEmail = async (email: string, amount: number) => {
  await sendMailService(email, "Payment Successful", paymentSuccessTemplate(amount));
};

export const sendRefundEmail = async (email: string, amount: number) => {
  await sendMailService(email, "Refund Successful", refundTemplate(amount));
};

// In-App Database Notifications
export const getUserNotificationsService = async (userId: string) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markNotificationAsReadService = async (
  notificationId: string,
  userId: string
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  });

  if (!notification) return null;

  notification.isRead = true;
  await notification.save();
  return notification;
};

export const markAllNotificationsAsReadService = async (userId: string) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
};

export const deleteNotificationService = async (
  notificationId: string,
  userId: string
) => {
  await Notification.deleteOne({ _id: notificationId, user: userId });
};

export const createInAppNotificationService = async (
  userId: string,
  title: string,
  message: string,
  type: "ORDER" | "DELIVERY" | "PAYMENT" | "SYSTEM" = "SYSTEM"
) => {
  return await Notification.create({
    user: userId,
    title,
    message,
    type,
  });
};
