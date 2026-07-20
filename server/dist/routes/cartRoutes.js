"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const cartValidator_1 = require("../validators/cartValidator");
const router = express_1.default.Router();
// Add item
router.post("/", authMiddleware_1.protect, cartValidator_1.cartValidator, validateRequest_1.default, cartController_1.addToCart);
// Get cart
router.get("/", authMiddleware_1.protect, cartController_1.getCart);
// Update quantity
router.put("/", authMiddleware_1.protect, cartValidator_1.cartValidator, validateRequest_1.default, cartController_1.updateCart);
// Remove item
router.delete("/", authMiddleware_1.protect, cartValidator_1.removeCartItemValidator, validateRequest_1.default, cartController_1.removeFromCart);
// Clear cart
router.delete("/clear", authMiddleware_1.protect, cartController_1.clearCart);
exports.default = router;
