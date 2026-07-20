import { Response } from "express";

import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

import { ApiResponse } from "../utils/apiResponse";

import {
  getDashboardOverviewService,
  getRevenueAnalyticsService,
  getRecentOrdersService,
  getTopFoodsService,
  getDashboardStatsService,
  getUserGrowthService,
} from "../services/dashboardService";



export const getDashboardOverview =
  asyncHandler(
    async (
      _req: AuthRequest,
      res: Response
    ) => {

      const data =
        await getDashboardOverviewService();

      res.status(200).json(
        new ApiResponse(
          true,
          "Dashboard fetched successfully",
          data
        )
      );

    }
  );



export const getRevenueAnalytics =
  asyncHandler(
    async (
      _req: AuthRequest,
      res: Response
    ) => {

      const data =
        await getRevenueAnalyticsService();

      res.status(200).json(
        new ApiResponse(
          true,
          "Revenue analytics fetched",
          data
        )
      );

    }
  );



export const getRecentOrders =
  asyncHandler(
    async (
      _req: AuthRequest,
      res: Response
    ) => {

      const data =
        await getRecentOrdersService();

      res.status(200).json(
        new ApiResponse(
          true,
          "Recent orders fetched",
          data
        )
      );

    }
  );



export const getTopFoods =
  asyncHandler(
    async (
      _req: AuthRequest,
      res: Response
    ) => {

      const data =
        await getTopFoodsService();

      res.status(200).json(
        new ApiResponse(
          true,
          "Top foods fetched",
          data
        )
      );

    }
  );



export const getDashboardStats =
  asyncHandler(
    async (
      _req: AuthRequest,
      res: Response
    ) => {

      const data =
        await getDashboardStatsService();

      res.status(200).json(
        new ApiResponse(
          true,
          "Dashboard stats fetched",
          data
        )
      );

    }
  );

  export const getUserGrowth =
  asyncHandler(
    async (
      _req: AuthRequest,
      res: Response
    ) => {

      const data =
        await getUserGrowthService();

      res.status(200).json(
        new ApiResponse(
          true,
          "User growth fetched successfully",
          data
        )
      );

    }
  );