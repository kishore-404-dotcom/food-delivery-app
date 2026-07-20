import Order from "../models/order";
import Food from "../models/food";
import User from "../models/user";

import {
  getCache,
  setCache,
} from "./cacheService";


// Dashboard Overview
export const getDashboardOverviewService =
  async () => {

    // Check Redis cache
    const cached =
      await getCache(
        "dashboard-overview"
      );

    if (cached) {
      return JSON.parse(cached);
    }

    // Total Orders
    const totalOrders =
      await Order.countDocuments();

    // Total Foods
    const totalFoods =
      await Food.countDocuments();

    // Total Users
    const totalUsers =
      await User.countDocuments();

    // Total Revenue
    const revenueResult =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    const data = {
      totalOrders,
      totalFoods,
      totalUsers,
      totalRevenue,
    };

    // Store in Redis cache
    await setCache(
      "dashboard-overview",
      data
    );

    return data;

  };


// Revenue Analytics
export const getRevenueAnalyticsService =
  async () => {

    return await Order.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

  };


// Recent Orders
export const getRecentOrdersService =
  async () => {

    return await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .limit(10);

  };


// Top Selling Foods
export const getTopFoodsService =
  async () => {

    return await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.food",
          totalSold: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

  };


// Dashboard Statistics
export const getDashboardStatsService =
  async () => {

    const deliveredOrders =
      await Order.countDocuments({
        orderStatus: "DELIVERED",
      });

    const pendingOrders =
      await Order.countDocuments({
        orderStatus: "PLACED",
      });

    const cancelledOrders =
      await Order.countDocuments({
        orderStatus: "CANCELLED",
      });

    return {
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
    };

  };

  // User Growth Analytics
export const getUserGrowthService =
  async () => {

    return await User.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          totalUsers: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

  };