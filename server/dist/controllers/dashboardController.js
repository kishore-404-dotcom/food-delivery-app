"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGrowth = exports.getDashboardStats = exports.getTopFoods = exports.getRecentOrders = exports.getRevenueAnalytics = exports.getDashboardOverview = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const dashboardService_1 = require("../services/dashboardService");
exports.getDashboardOverview = (0, asyncHandler_1.default)(async (_req, res) => {
    const data = await (0, dashboardService_1.getDashboardOverviewService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Dashboard fetched successfully", data));
});
exports.getRevenueAnalytics = (0, asyncHandler_1.default)(async (_req, res) => {
    const data = await (0, dashboardService_1.getRevenueAnalyticsService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Revenue analytics fetched", data));
});
exports.getRecentOrders = (0, asyncHandler_1.default)(async (_req, res) => {
    const data = await (0, dashboardService_1.getRecentOrdersService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Recent orders fetched", data));
});
exports.getTopFoods = (0, asyncHandler_1.default)(async (_req, res) => {
    const data = await (0, dashboardService_1.getTopFoodsService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Top foods fetched", data));
});
exports.getDashboardStats = (0, asyncHandler_1.default)(async (_req, res) => {
    const data = await (0, dashboardService_1.getDashboardStatsService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Dashboard stats fetched", data));
});
exports.getUserGrowth = (0, asyncHandler_1.default)(async (_req, res) => {
    const data = await (0, dashboardService_1.getUserGrowthService)();
    res.status(200).json(new apiResponse_1.ApiResponse(true, "User growth fetched successfully", data));
});
