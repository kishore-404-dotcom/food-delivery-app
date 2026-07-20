"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const paymentValidator_1 = require("../validators/paymentValidator");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
// Create Payment
router.post("/create", authMiddleware_1.protect, rateLimiter_1.paymentLimiter, paymentValidator_1.paymentValidator, validateRequest_1.default, paymentController_1.createPayment);
// Get My Payments
router.get("/my-payments", authMiddleware_1.protect, paymentController_1.getMyPayments);
// Admin - Get All Payments
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, paymentValidator_1.paymentQueryValidator, validateRequest_1.default, paymentController_1.getAllPayments);
// Get Payment By ID
router.get("/:id", authMiddleware_1.protect, paymentValidator_1.paymentIdValidator, validateRequest_1.default, paymentController_1.getPaymentById);
// Dummy Success
router.put("/success/:id", authMiddleware_1.protect, rateLimiter_1.paymentLimiter, paymentValidator_1.paymentIdValidator, validateRequest_1.default, paymentController_1.paymentSuccess);
// Dummy Failed
router.put("/failed/:id", authMiddleware_1.protect, rateLimiter_1.paymentLimiter, paymentValidator_1.paymentIdValidator, validateRequest_1.default, paymentController_1.paymentFailed);
exports.default = router;
