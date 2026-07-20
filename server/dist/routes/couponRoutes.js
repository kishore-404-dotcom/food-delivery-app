"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const couponValidator_1 = require("../validators/couponValidator");
const router = express_1.default.Router();
// Create coupon (Admin only)
router.post("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, couponValidator_1.couponValidator, validateRequest_1.default, couponController_1.createCoupon);
// Get all coupons
router.get("/", couponController_1.getCoupons);
// Get coupon by code
router.get("/:code", couponController_1.getCouponByCode);
// Apply coupon
router.post("/apply", authMiddleware_1.protect, couponController_1.applyCoupon);
// Delete coupon (Admin only)
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, couponController_1.deleteCoupon);
exports.default = router;
