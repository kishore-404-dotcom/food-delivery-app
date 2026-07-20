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
const router = express_1.default.Router();
// Create Payment
router.post("/create", authMiddleware_1.protect, paymentValidator_1.paymentValidator, validateRequest_1.default, paymentController_1.createPayment);
// Get My Payments
router.get("/my-payments", authMiddleware_1.protect, paymentController_1.getMyPayments);
// Get Payment By ID
router.get("/:id", authMiddleware_1.protect, paymentController_1.getPaymentById);
// Payment Success (Dummy)
router.put("/success/:id", authMiddleware_1.protect, paymentController_1.paymentSuccess);
// Payment Failed (Dummy)
router.put("/failed/:id", authMiddleware_1.protect, paymentController_1.paymentFailed);
// Get All Payments (Admin)
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, paymentController_1.getAllPayments);
exports.default = router;
