import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  createPaymentService,
  getMyPaymentsService,
  getPaymentByIdService,
  paymentSuccessService,
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

// Payment Success
export const paymentSuccess = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as {
      id: string;
    };

    const payment = await paymentSuccessService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Payment completed successfully",
        payment
      )
    );
  }
);

// Payment Failed
export const paymentFailed = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as {
      id: string;
    };

    const payment = await paymentFailedService(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "Payment marked as failed",
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