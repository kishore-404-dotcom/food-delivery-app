import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendOrderPlacedEmail,
  sendDeliveredEmail,
  sendPaymentSuccessEmail,
  sendRefundEmail,
} from "../services/notificationService";


// Welcome Email
export const sendWelcomeNotification =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const { email, name } = req.body;

      await sendWelcomeEmail(
        email,
        name
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Welcome email sent successfully"
        )
      );
    }
  );


// Forgot Password Email
export const sendForgotPasswordNotification =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const { email, link } = req.body;

      await sendForgotPasswordEmail(
        email,
        link
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Reset password email sent successfully"
        )
      );
    }
  );


// Order Placed Email
export const sendOrderPlacedNotification =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        email,
        orderId,
      } = req.body;

      await sendOrderPlacedEmail(
        email,
        orderId
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Order email sent successfully"
        )
      );
    }
  );


// Delivered Email
export const sendDeliveredNotification =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        email,
        orderId,
      } = req.body;

      await sendDeliveredEmail(
        email,
        orderId
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Delivered email sent successfully"
        )
      );
    }
  );


// Payment Success Email
export const sendPaymentSuccessNotification =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        email,
        amount,
      } = req.body;

      await sendPaymentSuccessEmail(
        email,
        amount
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Payment email sent successfully"
        )
      );
    }
  );


// Refund Email
export const sendRefundNotification =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        email,
        amount,
      } = req.body;

      await sendRefundEmail(
        email,
        amount
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Refund email sent successfully"
        )
      );
    }
  );