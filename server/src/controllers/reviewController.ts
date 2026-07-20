import { Response } from "express";

// Middleware
import asyncHandler from "../middleware/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

// Services
import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getReviewsByFoodService,
  getMyReviewsService,
  getReviewByIdService,
  getAllReviewsService,
} from "../services/reviewService";

// Utils
import { ApiResponse } from "../utils/apiResponse";

// -------------------------
// Request Types
// -------------------------

interface CreateReviewBody {
  order: string;
  food: string;
  rating: number;
  comment: string;
}

interface UpdateReviewBody {
  rating: number;
  comment: string;
}

interface ReviewQuery {
  page?: string;
  limit?: string;
  sort?: string;
  rating?: string;
  search?: string;
}

// -------------------------
// Create Review
// -------------------------

export const createReview = asyncHandler(
  async (
    req: AuthRequest<
      {},
      any,
      CreateReviewBody
    >,
    res: Response
  ) => {

    const {
      order,
      food,
      rating,
      comment,
    } = req.body;

    const review =
      await createReviewService(
        req.user!.id,
        order,
        food,
        rating,
        comment
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Review created successfully",
        review
      )
    );

  }
);

// -------------------------
// Update Review
// -------------------------

export const updateReview = asyncHandler(
  async (
    req: AuthRequest<
      { id: string },
      any,
      UpdateReviewBody
    >,
    res: Response
  ) => {

    const review =
      await updateReviewService(
        req.params.id,
        req.user!.id,
        req.body.rating,
        req.body.comment
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Review updated successfully",
        review
      )
    );

  }
);

// -------------------------
// Delete Review
// -------------------------

export const deleteReview = asyncHandler(
  async (
    req: AuthRequest<{ id: string }>,
    res: Response
  ) => {

    await deleteReviewService(
      req.params.id,
      req.user!.id
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Review deleted successfully"
      )
    );

  }
);

// -------------------------
// Get Reviews By Food
// -------------------------

export const getReviewsByFood =
  asyncHandler(
    async (
      req: AuthRequest<
        { foodId: string },
        any,
        any,
        ReviewQuery
      >,
      res: Response
    ) => {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const sort =
        req.query.sort ||
        "-createdAt";

      const rating =
        req.query.rating
          ? Number(req.query.rating)
          : undefined;

      const search =
        req.query.search;

      const reviews =
        await getReviewsByFoodService(
          req.params.foodId,
          page,
          limit,
          sort,
          rating,
          search
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Reviews fetched successfully",
          reviews
        )
      );

    }
  );

// -------------------------
// Get My Reviews
// -------------------------

export const getMyReviews =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const reviews =
        await getMyReviewsService(
          req.user!.id
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Reviews fetched successfully",
          reviews
        )
      );

    }
  );

// -------------------------
// Get Review By ID
// -------------------------

export const getReviewById =
  asyncHandler(
    async (
      req: AuthRequest<{ id: string }>,
      res: Response
    ) => {

      const review =
        await getReviewByIdService(
          req.params.id
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Review fetched successfully",
          review
        )
      );

    }
  );

// -------------------------
// Get All Reviews (Admin)
// -------------------------

export const getAllReviews =
  asyncHandler(
    async (
      req: AuthRequest<
        {},
        any,
        any,
        ReviewQuery
      >,
      res: Response
    ) => {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const sort =
        req.query.sort ||
        "-createdAt";

      const rating =
        req.query.rating
          ? Number(req.query.rating)
          : undefined;

      const search =
        req.query.search;

      const reviews =
        await getAllReviewsService(
          page,
          limit,
          sort,
          rating,
          search
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Reviews fetched successfully",
          reviews
        )
      );

    }
  );

// -------------------------
// Delete Any Review (Admin)
// -------------------------

export const adminDeleteReview =
  asyncHandler(
    async (
      req: AuthRequest<{ id: string }>,
      res: Response
    ) => {

      await deleteReviewService(
        req.params.id,
        req.user!.id,
        true
      );

      res.status(200).json(
        new ApiResponse(
          true,
          "Review deleted successfully"
        )
      );

    }
  );