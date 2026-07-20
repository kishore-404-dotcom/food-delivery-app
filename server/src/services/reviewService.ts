import Food from "../models/food";
import Order from "../models/order";
import Review from "../models/review";

import { ApiError } from "../utils/apiError";

// -------------------------------------
// Update Food Rating
// -------------------------------------
const updateFoodRating = async (
  foodId: string
): Promise<void> => {

  const reviews = await Review.find({
    food: foodId,
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / totalReviews;

  await Food.findByIdAndUpdate(
    foodId,
    {
      averageRating: Number(
        averageRating.toFixed(1)
      ),
      totalReviews,
    }
  );

};

// -------------------------------------
// Create Review
// -------------------------------------
export const createReviewService = async (
  userId: string,
  orderId: string,
  foodId: string,
  rating: number,
  comment: string
) => {

  const food = await Food.findById(foodId);

  if (!food) {
    throw new ApiError(
      404,
      "Food not found"
    );
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
    paymentStatus: "PAID",
    orderStatus: "DELIVERED",
    "items.food": foodId,
  });

  if (!order) {
    throw new ApiError(
      400,
      "You can review only delivered food"
    );
  }

  const existingReview =
    await Review.findOne({
      user: userId,
      food: foodId,
    });

  if (existingReview) {
    throw new ApiError(
      400,
      "You have already reviewed this food"
    );
  }

  const review =
    await Review.create({
      user: userId,
      order: order._id,
      food: foodId,
      rating,
      comment,
    });

  await updateFoodRating(foodId);

  return review;

};

// -------------------------------------
// Update Review
// -------------------------------------
export const updateReviewService = async (
  reviewId: string,
  userId: string,
  rating: number,
  comment: string
) => {

  const review = await Review.findById(
    reviewId
  );

  if (!review) {
    throw new ApiError(
      404,
      "Review not found"
    );
  }

  if (
    review.user.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  review.rating = rating;
  review.comment = comment;
  review.isEdited = true;

  await review.save();

  await updateFoodRating(
    review.food.toString()
  );

  return review;

};

// -------------------------------------
// Delete Review
// -------------------------------------
export const deleteReviewService = async (
  reviewId: string,
  userId: string,
  isAdmin: boolean = false
) => {

  const review = await Review.findById(
    reviewId
  );

  if (!review) {
    throw new ApiError(
      404,
      "Review not found"
    );
  }

  if (
    !isAdmin &&
    review.user.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  const foodId =
    review.food.toString();

  await review.deleteOne();

  await updateFoodRating(
    foodId
  );

  return {
    message:
      "Review deleted successfully",
  };

};

// -------------------------------------
// Get Reviews By Food
// -------------------------------------
export const getReviewsByFoodService = async (
  foodId: string,
  page: number,
  limit: number,
  sort: string = "-createdAt",
  rating?: number,
  search?: string
) => {

  const filter: any = {
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

  const reviews = await Review.find(filter)
    .populate("user", "name profileImage")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total =
    await Review.countDocuments(filter);

  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(
      total / limit
    ),
    reviews,
  };

};

// -------------------------------------
// Get My Reviews
// -------------------------------------
export const getMyReviewsService = async (
  userId: string
) => {

  return await Review.find({
    user: userId,
  })
    .populate("food")
    .populate("order")
    .sort({
      createdAt: -1,
    });

};

// -------------------------------------
// Get Review By ID
// -------------------------------------
export const getReviewByIdService = async (
  reviewId: string
) => {

  const review = await Review.findById(
    reviewId
  )
    .populate("user", "name email")
    .populate("food")
    .populate("order");

  if (!review) {
    throw new ApiError(
      404,
      "Review not found"
    );
  }

  return review;

};

// -------------------------------------
// Get All Reviews (Admin)
// -------------------------------------
export const getAllReviewsService = async (
  page: number,
  limit: number,
  sort: string = "-createdAt",
  rating?: number,
  search?: string
) => {

  const filter: any = {};

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

  const reviews = await Review.find(filter)
    .populate("user", "name email")
    .populate("food")
    .populate("order")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total =
    await Review.countDocuments(filter);

  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(
      total / limit
    ),
    reviews,
  };

};