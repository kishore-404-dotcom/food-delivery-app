import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  createPaymentService,
  getMyPaymentsService,
  getPaymentByIdService,
  verifyPaymentService,
  paymentFailedService,
  getAllPaymentsService,
} from "../services/paymentService";

// Create Payment
export const createPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { orderId } = req.body as {
      orderId: string;
    };

    const payment = await createPaymentService(
      req.user!.id,
      orderId
    );

    res.status(201).json(
      new ApiResponse(
        true,
        "Payment created successfully",
        payment
      )
    );
  }
);

// Get My Payments
export const getMyPayments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const payments = await getMyPaymentsService(
      req.user!.id
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Payments fetched successfully",
        payments
      )
    );
  }
);

// Get Payment By ID
export const getPaymentById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as {
      id: string;
    };

    const payment = await getPaymentByIdService(
      id,
      req.user!.id
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Payment fetched successfully",
        payment
      )
    );
  }
);

// Verify Razorpay signature before marking the payment successful
export const verifyPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const payment = await verifyPaymentService(req.user!.id, {
      razorpayOrderId: req.body.razorpayOrderId,
      razorpayPaymentId: req.body.razorpayPaymentId,
      razorpaySignature: req.body.razorpaySignature,
    });

    res.status(200).json(
      new ApiResponse(
        true,
        "Payment verified successfully",
        payment
      )
    );
  }
);

// Payment Failed
export const paymentFailed = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const payment = await paymentFailedService(
      req.user!.id,
      req.body.razorpayOrderId,
      req.body.reason,
      req.body.abandoned === true
    );

    res.status(200).json(
      new ApiResponse(
        true,
        req.body.abandoned ? "Payment marked as abandoned" : "Payment marked as failed",
        payment
      )
    );
  }
);

// Get All Payments (Admin)
export const getAllPayments = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const {
      page,
      limit,
      sort,
      status,
      paymentMethod,
      search,
    } = req.query as {
      page?: string;
      limit?: string;
      sort?: string;
      status?: string;
      paymentMethod?: string;
      search?: string;
    };

    const payments =
      await getAllPaymentsService(
        Number(page) || 1,
        Number(limit) || 10,
        sort || "-createdAt",
        status,
        paymentMethod,
        search
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Payments fetched successfully",
        payments
      )
    );

  }
);
