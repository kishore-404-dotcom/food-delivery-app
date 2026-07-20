"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/overview", authMiddleware_1.protect, authMiddleware_1.adminOnly, dashboardController_1.getDashboardOverview);
router.get("/revenue", authMiddleware_1.protect, authMiddleware_1.adminOnly, dashboardController_1.getRevenueAnalytics);
router.get("/recent-orders", authMiddleware_1.protect, authMiddleware_1.adminOnly, dashboardController_1.getRecentOrders);
router.get("/top-foods", authMiddleware_1.protect, authMiddleware_1.adminOnly, dashboardController_1.getTopFoods);
router.get("/stats", authMiddleware_1.protect, authMiddleware_1.adminOnly, dashboardController_1.getDashboardStats);
router.get("/user-growth", authMiddleware_1.protect, authMiddleware_1.adminOnly, dashboardController_1.getUserGrowth);
exports.default = router;
