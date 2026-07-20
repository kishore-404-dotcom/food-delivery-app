"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGrowthService = exports.getDashboardStatsService = exports.getTopFoodsService = exports.getRecentOrdersService = exports.getRevenueAnalyticsService = exports.getDashboardOverviewService = void 0;
const order_1 = __importDefault(require("../models/order"));
const food_1 = __importDefault(require("../models/food"));
const user_1 = __importDefault(require("../models/user"));
const cacheService_1 = require("./cacheService");
// Dashboard Overview
const getDashboardOverviewService = async () => {
    // Check Redis cache
    const cached = await (0, cacheService_1.getCache)("dashboard-overview");
    if (cached) {
        return JSON.parse(cached);
    }
    // Total Orders
    const totalOrders = await order_1.default.countDocuments();
    // Total Foods
    const totalFoods = await food_1.default.countDocuments();
    // Total Users
    const totalUsers = await user_1.default.countDocuments();
    // Total Revenue
    const revenueResult = await order_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$totalAmount",
                },
            },
        },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const data = {
        totalOrders,
        totalFoods,
        totalUsers,
        totalRevenue,
    };
    // Store in Redis cache
    await (0, cacheService_1.setCache)("dashboard-overview", data);
    return data;
};
exports.getDashboardOverviewService = getDashboardOverviewService;
// Revenue Analytics
const getRevenueAnalyticsService = async () => {
    return await order_1.default.aggregate([
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
exports.getRevenueAnalyticsService = getRevenueAnalyticsService;
// Recent Orders
const getRecentOrdersService = async () => {
    return await order_1.default.find()
        .populate("user", "name email")
        .sort({
        createdAt: -1,
    })
        .limit(10);
};
exports.getRecentOrdersService = getRecentOrdersService;
// Top Selling Foods
const getTopFoodsService = async () => {
    return await order_1.default.aggregate([
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
exports.getTopFoodsService = getTopFoodsService;
// Dashboard Statistics
const getDashboardStatsService = async () => {
    const deliveredOrders = await order_1.default.countDocuments({
        orderStatus: "DELIVERED",
    });
    const pendingOrders = await order_1.default.countDocuments({
        orderStatus: "PLACED",
    });
    const cancelledOrders = await order_1.default.countDocuments({
        orderStatus: "CANCELLED",
    });
    return {
        deliveredOrders,
        pendingOrders,
        cancelledOrders,
    };
};
exports.getDashboardStatsService = getDashboardStatsService;
// User Growth Analytics
const getUserGrowthService = async () => {
    return await user_1.default.aggregate([
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
exports.getUserGrowthService = getUserGrowthService;
