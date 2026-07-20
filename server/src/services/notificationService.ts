import { sendMailService } from "./emailService";

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



export const sendWelcomeEmail =
  async (
    email: string,
    name: string
  ) => {

    await sendMailService(
      email,
      "Welcome",
      welcomeTemplate(name)
    );
  };



export const sendForgotPasswordEmail =
  async (
    email: string,
    link: string
  ) => {

    await sendMailService(
      email,
      "Reset Password",
      forgotPasswordTemplate(link)
    );
  };



export const sendOrderPlacedEmail =
  async (
    email: string,
    orderId: string
  ) => {

    await sendMailService(
      email,
      "Order Placed",
      orderPlacedTemplate(orderId)
    );
  };



export const sendDeliveredEmail =
  async (
    email: string,
    orderId: string
  ) => {

    await sendMailService(
      email,
      "Order Delivered",
      deliveredTemplate(orderId)
    );
  };



export const sendPaymentSuccessEmail =
  async (
    email: string,
    amount: number
  ) => {

    await sendMailService(
      email,
      "Payment Successful",
      paymentSuccessTemplate(amount)
    );
  };



export const sendRefundEmail =
  async (
    email: string,
    amount: number
  ) => {

    await sendMailService(
      email,
      "Refund Successful",
      refundTemplate(amount)
    );
  };