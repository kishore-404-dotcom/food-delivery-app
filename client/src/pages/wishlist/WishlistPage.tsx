import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaStar,
} from "react-icons/fa";
import { useWishlist } from "../../hooks/useWishlist";
import type { IFood } from "../../types/food";

const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

function WishlistItemCard({
  food,
  onMoveToCart,
  onRemove,
}: {
  food: IFood;
  onMoveToCart: (foodId: string, foodName: string) => void;
  onRemove: (foodId: string) => void;
}) {
  const [imgSrc, setImgSrc] = useState(food.image || DEFAULT_FOOD_IMAGE);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border transition hover:shadow-md">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={imgSrc}
          alt={food.name}
          onError={() => setImgSrc(DEFAULT_FOOD_IMAGE)}
          className="h-full w-full object-cover"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
            food.isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {food.isAvailable ? "Available" : "Sold Out"}
        </span>

        <button
          onClick={() => onRemove(food._id)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow hover:bg-red-50"
          title="Remove from Wishlist"
        >
          <FaTrash size={14} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900">{food.name}</h3>

          <div className="flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">
            <FaStar className="text-xs" />
            <span>{food.averageRating > 0 ? food.averageRating.toFixed(1) : "New"}</span>
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-gray-500 font-medium">
          {food.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-xl font-extrabold text-orange-500">₹{food.price}</span>

          <button
            onClick={() => onMoveToCart(food._id, food.name)}
            disabled={!food.isAvailable}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow transition ${
              food.isAvailable
                ? "bg-orange-500 hover:bg-orange-600 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaShoppingCart /> Move to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function WishlistPage() {
  const { wishlist, loading, removeItem, clear, moveItemToCart } = useWishlist();

  // Safely extract valid food objects, handling deleted/null backend references
  const validWishlistItems =
    wishlist?.items?.filter(
      (item) => item.food && typeof item.food === "object" && (item.food as IFood)._id
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Wishlist ❤️
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your favorite dishes saved for future cravings
            </p>
          </div>

          {validWishlistItems.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm hover:bg-red-50 transition"
            >
              <FaTrash /> Clear Wishlist
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-600">Loading your wishlist...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && validWishlistItems.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <FaHeart size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Wishlist is Empty</h2>
            <p className="mt-2 text-gray-500">
              Click the heart icon on any food card to save your favorite dishes here.
            </p>
            <Link
              to="/foods"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 shadow"
            >
              <FaArrowLeft /> Explore Food Menu
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && validWishlistItems.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {validWishlistItems.map((item) => (
              <WishlistItemCard
                key={(item.food as IFood)._id}
                food={item.food as IFood}
                onMoveToCart={moveItemToCart}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
