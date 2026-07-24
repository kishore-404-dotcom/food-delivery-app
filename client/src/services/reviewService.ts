import api from "./api";
import type { IReview, ApiResponse } from "../types/food";

export interface CreateReviewInput {
  order: string;
  food: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewInput {
  rating: number;
  comment: string;
}

export interface PaginatedReviews {
  total: number;
  currentPage: number;
  totalPages: number;
  reviews: IReview[];
}

export const createReview = async (data: CreateReviewInput): Promise<IReview> => {
  const response = await api.post<ApiResponse<IReview>>("/reviews", data);
  return response.data.data;
};

export const updateReview = async (
  id: string,
  data: UpdateReviewInput
): Promise<IReview> => {
  const response = await api.put<ApiResponse<IReview>>(`/reviews/${id}`, data);
  return response.data.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/reviews/${id}`);
};

export const getReviewsByFood = async (
  foodId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedReviews> => {
  const response = await api.get<ApiResponse<PaginatedReviews>>(
    `/reviews/food/${foodId}?page=${page}&limit=${limit}`
  );
  return response.data.data;
};

export const getMyReviews = async (): Promise<IReview[]> => {
  const response = await api.get<ApiResponse<IReview[]>>("/reviews/my-reviews");
  return response.data.data;
};

export const getReviewById = async (id: string): Promise<IReview> => {
  const response = await api.get<ApiResponse<IReview>>(`/reviews/${id}`);
  return response.data.data;
};

export const getAllReviews = async (): Promise<IReview[]> => {
  const response = await api.get<ApiResponse<PaginatedReviews>>("/reviews");
  return response.data.data.reviews;
};
