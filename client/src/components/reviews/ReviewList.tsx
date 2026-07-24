import { useState, useEffect, useCallback } from "react";
import { FaStar, FaEdit, FaTrash, FaUser, FaQuoteLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import type { IReview, IUser } from "../../types/food";
import { useAuth } from "../../hooks/useAuth";
import {
  getReviewsByFood,
  deleteReview,
} from "../../services/reviewService";
import ReviewModal from "./ReviewModal";

interface ReviewListProps {
  foodId: string;
  refreshTrigger?: number;
  onReviewsUpdated?: () => void;
}

export function ReviewList({
  foodId,
  refreshTrigger = 0,
  onReviewsUpdated,
}: ReviewListProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal State
  const [editingReview, setEditingReview] = useState<IReview | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getReviewsByFood(foodId);
      setReviews(res.reviews || []);
      setTotal(res.total || 0);
    } catch (err: unknown) {
      console.error("Failed to load food reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [foodId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshTrigger]);

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted!");
      fetchReviews();
      if (onReviewsUpdated) onReviewsUpdated();
    } catch (err: unknown) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="py-6 text-center text-xs font-medium text-gray-500">
        Loading customer reviews...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          <span>Customer Reviews</span>
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
            {total}
          </span>
        </h4>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-6 text-center text-xs text-gray-400">
          No reviews yet for this dish. Be the first to share your review!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => {
            const reviewer =
              typeof rev.user === "object" && rev.user !== null
                ? (rev.user as IUser)
                : null;
            const isOwner = user && reviewer && user._id === reviewer._id;

            return (
              <div
                key={rev._id}
                className="rounded-2xl bg-gray-50 p-4 border border-gray-100 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-[10px]">
                      {reviewer?.name ? reviewer.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">
                        {reviewer?.name || "Customer"}
                      </span>
                      {rev.isEdited && (
                        <span className="ml-1 text-[10px] text-gray-400 font-medium">
                          (Edited)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <FaStar />
                    <span className="text-gray-800">{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed font-medium pl-2 border-l-2 border-orange-300 flex items-start gap-1">
                  <FaQuoteLeft className="text-orange-200 text-xs flex-shrink-0 mt-0.5" />
                  <span>{rev.comment}</span>
                </p>

                {isOwner && (
                  <div className="flex justify-end gap-3 pt-1 border-t border-gray-200/60">
                    <button
                      onClick={() => setEditingReview(rev)}
                      className="flex items-center gap-1 text-gray-500 hover:text-orange-500 font-bold"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-red-500 font-bold"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewModal
          isOpen={Boolean(editingReview)}
          onClose={() => setEditingReview(null)}
          foodId={foodId}
          initialReview={editingReview}
          onSubmitted={() => {
            fetchReviews();
            if (onReviewsUpdated) onReviewsUpdated();
          }}
        />
      )}
    </div>
  );
}

export default ReviewList;
