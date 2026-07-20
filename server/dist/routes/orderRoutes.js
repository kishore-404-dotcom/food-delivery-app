"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const orderValidator_1 = require("../validators/orderValidator");
const router = express_1.default.Router();
// Place order
router.post("/", authMiddleware_1.protect, orderValidator_1.orderValidator, validateRequest_1.default, orderController_1.placeOrder);
// Get my orders
router.get("/my-orders", authMiddleware_1.protect, orderController_1.getMyOrders);
// Get all orders (admin)
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, orderController_1.getAllOrders);
// Update order status (admin)
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, orderValidator_1.orderStatusValidator, validateRequest_1.default, orderController_1.updateOrderStatus);
exports.default = router;
