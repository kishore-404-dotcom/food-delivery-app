"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlistController_1 = require("../controllers/wishlistController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, wishlistController_1.addToWishlist);
router.get("/", authMiddleware_1.protect, wishlistController_1.getWishlist);
router.delete("/", authMiddleware_1.protect, wishlistController_1.removeFromWishlist);
router.delete("/clear", authMiddleware_1.protect, wishlistController_1.clearWishlist);
router.get("/check/:foodId", authMiddleware_1.protect, wishlistController_1.checkWishlist);
router.post("/move-to-cart", authMiddleware_1.protect, wishlistController_1.moveToCart);
exports.default = router;
