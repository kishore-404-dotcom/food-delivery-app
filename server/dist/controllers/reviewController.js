"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteReview = exports.getAllReviews = exports.getReviewById = exports.getMyReviews = exports.getReviewsByFood = exports.deleteReview = exports.updateReview = exports.createReview = void 0;
// Middleware
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// Services
const reviewService_1 = require("../services/reviewService");
// Utils
const apiResponse_1 = require("../utils/apiResponse");
// -------------------------
// Create Review
// -------------------------
exports.createReview = (0, asyncHandler_1.default)(async (req, res) => {
    const { order, food, rating, comment, } = req.body;
    const review = await (0, reviewService_1.createReviewService)(req.user.id, order, food, rating, comment);
    res.status(201).json(new apiResponse_1.ApiResponse(true, "Review created successfully", review));
});
// -------------------------
// Update Review
// -------------------------
exports.updateReview = (0, asyncHandler_1.default)(async (req, res) => {
    const review = await (0, reviewService_1.updateReviewService)(req.params.id, req.user.id, req.body.rating, req.body.comment);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Review updated successfully", review));
});
// -------------------------
// Delete Review
// -------------------------
exports.deleteReview = (0, asyncHandler_1.default)(async (req, res) => {
    await (0, reviewService_1.deleteReviewService)(req.params.id, req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Review deleted successfully"));
});
// -------------------------
// Get Reviews By Food
// -------------------------
exports.getReviewsByFood = (0, asyncHandler_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort ||
        "-createdAt";
    const rating = req.query.rating
        ? Number(req.query.rating)
        : undefined;
    const search = req.query.search;
    const reviews = await (0, reviewService_1.getReviewsByFoodService)(req.params.foodId, page, limit, sort, rating, search);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Reviews fetched successfully", reviews));
});
// -------------------------
// Get My Reviews
// -------------------------
exports.getMyReviews = (0, asyncHandler_1.default)(async (req, res) => {
    const reviews = await (0, reviewService_1.getMyReviewsService)(req.user.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Reviews fetched successfully", reviews));
});
// -------------------------
// Get Review By ID
// -------------------------
exports.getReviewById = (0, asyncHandler_1.default)(async (req, res) => {
    const review = await (0, reviewService_1.getReviewByIdService)(req.params.id);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Review fetched successfully", review));
});
// -------------------------
// Get All Reviews (Admin)
// -------------------------
exports.getAllReviews = (0, asyncHandler_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort ||
        "-createdAt";
    const rating = req.query.rating
        ? Number(req.query.rating)
        : undefined;
    const search = req.query.search;
    const reviews = await (0, reviewService_1.getAllReviewsService)(page, limit, sort, rating, search);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Reviews fetched successfully", reviews));
});
// -------------------------
// Delete Any Review (Admin)
// -------------------------
exports.adminDeleteReview = (0, asyncHandler_1.default)(async (req, res) => {
    await (0, reviewService_1.deleteReviewService)(req.params.id, req.user.id, true);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Review deleted successfully"));
});
