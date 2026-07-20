"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const reviewValidator_1 = require("../validators/reviewValidator");
const router = express_1.default.Router();
// Create Review
router.post("/", authMiddleware_1.protect, reviewValidator_1.reviewValidator, validateRequest_1.default, reviewController_1.createReview);
// Logged-in user's reviews
router.get("/my-reviews", authMiddleware_1.protect, reviewController_1.getMyReviews);
// Reviews of a Food
router.get("/food/:foodId", reviewValidator_1.foodIdValidator, reviewValidator_1.reviewQueryValidator, validateRequest_1.default, reviewController_1.getReviewsByFood);
// Get Review By ID
router.get("/:id", reviewValidator_1.reviewIdValidator, validateRequest_1.default, reviewController_1.getReviewById);
// Update Review
router.put("/:id", authMiddleware_1.protect, reviewValidator_1.reviewIdValidator, reviewValidator_1.reviewValidator, validateRequest_1.default, reviewController_1.updateReview);
// Delete Own Review
router.delete("/:id", authMiddleware_1.protect, reviewValidator_1.reviewIdValidator, validateRequest_1.default, reviewController_1.deleteReview);
// ----------------------
// Admin Routes
// ----------------------
// Get All Reviews
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, reviewValidator_1.reviewQueryValidator, validateRequest_1.default, reviewController_1.getAllReviews);
// Delete Any Review
router.delete("/admin/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, reviewValidator_1.reviewIdValidator, validateRequest_1.default, reviewController_1.adminDeleteReview);
exports.default = router;
