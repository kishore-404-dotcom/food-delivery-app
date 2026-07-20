"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReviewsService = exports.getReviewByIdService = exports.getMyReviewsService = exports.getReviewsByFoodService = exports.deleteReviewService = exports.updateReviewService = exports.createReviewService = void 0;
const food_1 = __importDefault(require("../models/food"));
const order_1 = __importDefault(require("../models/order"));
const review_1 = __importDefault(require("../models/review"));
const apiError_1 = require("../utils/apiError");
// -------------------------------------
// Update Food Rating
// -------------------------------------
const updateFoodRating = async (foodId) => {
    const reviews = await review_1.default.find({
        food: foodId,
    });
    const totalReviews = reviews.length;
    const averageRating = totalReviews === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    await food_1.default.findByIdAndUpdate(foodId, {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
    });
};
// -------------------------------------
// Create Review
// -------------------------------------
const createReviewService = async (userId, orderId, foodId, rating, comment) => {
    const food = await food_1.default.findById(foodId);
    if (!food) {
        throw new apiError_1.ApiError(404, "Food not found");
    }
    const order = await order_1.default.findOne({
        _id: orderId,
        user: userId,
        paymentStatus: "PAID",
        orderStatus: "DELIVERED",
        "items.food": foodId,
    });
    if (!order) {
        throw new apiError_1.ApiError(400, "You can review only delivered food");
    }
    const existingReview = await review_1.default.findOne({
        user: userId,
        food: foodId,
    });
    if (existingReview) {
        throw new apiError_1.ApiError(400, "You have already reviewed this food");
    }
    const review = await review_1.default.create({
        user: userId,
        order: order._id,
        food: foodId,
        rating,
        comment,
    });
    await updateFoodRating(foodId);
    return review;
};
exports.createReviewService = createReviewService;
// -------------------------------------
// Update Review
// -------------------------------------
const updateReviewService = async (reviewId, userId, rating, comment) => {
    const review = await review_1.default.findById(reviewId);
    if (!review) {
        throw new apiError_1.ApiError(404, "Review not found");
    }
    if (review.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized");
    }
    review.rating = rating;
    review.comment = comment;
    review.isEdited = true;
    await review.save();
    await updateFoodRating(review.food.toString());
    return review;
};
exports.updateReviewService = updateReviewService;
// -------------------------------------
// Delete Review
// -------------------------------------
const deleteReviewService = async (reviewId, userId, isAdmin = false) => {
    const review = await review_1.default.findById(reviewId);
    if (!review) {
        throw new apiError_1.ApiError(404, "Review not found");
    }
    if (!isAdmin &&
        review.user.toString() !== userId) {
        throw new apiError_1.ApiError(403, "Unauthorized");
    }
    const foodId = review.food.toString();
    await review.deleteOne();
    await updateFoodRating(foodId);
    return {
        message: "Review deleted successfully",
    };
};
exports.deleteReviewService = deleteReviewService;
// -------------------------------------
// Get Reviews By Food
// -------------------------------------
const getReviewsByFoodService = async (foodId, page, limit, sort = "-createdAt", rating, search) => {
    const filter = {
        food: foodId,
    };
    if (rating) {
        filter.rating = rating;
    }
    if (search) {
        filter.comment = {
            $regex: search,
            $options: "i",
        };
    }
    const skip = (page - 1) * limit;
    const reviews = await review_1.default.find(filter)
        .populate("user", "name profileImage")
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await review_1.default.countDocuments(filter);
    return {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        reviews,
    };
};
exports.getReviewsByFoodService = getReviewsByFoodService;
// -------------------------------------
// Get My Reviews
// -------------------------------------
const getMyReviewsService = async (userId) => {
    return await review_1.default.find({
        user: userId,
    })
        .populate("food")
        .populate("order")
        .sort({
        createdAt: -1,
    });
};
exports.getMyReviewsService = getMyReviewsService;
// -------------------------------------
// Get Review By ID
// -------------------------------------
const getReviewByIdService = async (reviewId) => {
    const review = await review_1.default.findById(reviewId)
        .populate("user", "name email")
        .populate("food")
        .populate("order");
    if (!review) {
        throw new apiError_1.ApiError(404, "Review not found");
    }
    return review;
};
exports.getReviewByIdService = getReviewByIdService;
// -------------------------------------
// Get All Reviews (Admin)
// -------------------------------------
const getAllReviewsService = async (page, limit, sort = "-createdAt", rating, search) => {
    const filter = {};
    if (rating) {
        filter.rating = rating;
    }
    if (search) {
        filter.comment = {
            $regex: search,
            $options: "i",
        };
    }
    const skip = (page - 1) * limit;
    const reviews = await review_1.default.find(filter)
        .populate("user", "name email")
        .populate("food")
        .populate("order")
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await review_1.default.countDocuments(filter);
    return {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        reviews,
    };
};
exports.getAllReviewsService = getAllReviewsService;
