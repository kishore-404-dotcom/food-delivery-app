import express from "express";

import {
  getDashboardOverview,
  getRevenueAnalytics,
  getRecentOrders,
  getTopFoods,
  getDashboardStats,
  getUserGrowth,
} from "../controllers/dashboardController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";


const router = express.Router();


router.get(
  "/overview",
  protect,
  adminOnly,
  getDashboardOverview
);


router.get(
  "/revenue",
  protect,
  adminOnly,
  getRevenueAnalytics
);


router.get(
  "/recent-orders",
  protect,
  adminOnly,
  getRecentOrders
);


router.get(
  "/top-foods",
  protect,
  adminOnly,
  getTopFoods
);


router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

router.get(
  "/user-growth",
  protect,
  adminOnly,
  getUserGrowth
);

export default router;