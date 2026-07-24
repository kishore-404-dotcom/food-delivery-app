import { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import type { IReview } from "../../types/food";
import { createReview, updateReview } from "../../services/reviewService";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  foodId: string;
  foodName?: string;
  initialReview?: IReview | null;
  onSubmitted: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  orderId,
  foodId,
  foodName = "Dish",
  initialReview,
  onSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(initialReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(initialReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setComment(initialReview.comment);
    } else {
      setRating(5);
      setComment("");
    }
  }, [initialReview, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      setSubmitting(true);
      if (initialReview) {
        await updateReview(initialReview._id, { rating, comment: comment.trim() });
        toast.success("Review updated successfully!");
      } else {
        if (!orderId) {
          toast.error("Order reference is required to review delivered food");
          return;
        }
        await createReview({
          order: orderId,
          food: foodId,
          rating,
          comment: comment.trim(),
        });
        toast.success("Thank you! Review submitted successfully!");
      }

      onSubmitted();
      onClose();
    } catch (error: unknown) {
      console.error("Error submitting review:", error);
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Failed to submit review";
        toast.error(msg);
      } else {
        toast.error("Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-extrabold text-gray-900 text-xl">
              {initialReview ? "Edit Review 🌟" : `Review ${foodName} 🌟`}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Share your dining experience with others
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Rating Stars Picker */}
        <div className="text-center bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
            Your Rating
          </label>

          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition-transform hover:scale-125 focus:outline-none"
              >
                <FaStar
                  className={
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          <p className="text-xs font-bold text-orange-600 mt-2">
            {rating === 5 && "⭐ Excellent!"}
            {rating === 4 && "👍 Very Good!"}
            {rating === 3 && "👌 Good"}
            {rating === 2 && "😐 Fair"}
            {rating === 1 && "👎 Poor"}
          </p>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Your Review Comment *
            </label>
            <textarea
              rows={4}
              placeholder="How was the taste, portion size, and presentation?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-2xl border p-4 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-orange-600 active:scale-95"
            >
              {submitting ? "Submitting..." : initialReview ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
