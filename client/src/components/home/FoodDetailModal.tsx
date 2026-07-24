import { useState } from "react";
import { FaTimes, FaStar, FaUtensils, FaPlus } from "react-icons/fa";
import type { IFood, IRestaurant } from "../../types/food";

interface FoodDetailModalProps {
  food: IFood | null;
  onClose: () => void;
  onAddToCart?: (food: IFood) => void;
}

const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

import { useCart } from "../../hooks/useCart";

function FoodDetailModal({ food, onClose, onAddToCart }: FoodDetailModalProps) {
  const { addItem } = useCart();
  const [imgSrc, setImgSrc] = useState(
    food?.image || DEFAULT_FOOD_IMAGE
  );

  if (!food) return null;

  const restaurantName =
    typeof food.restaurant === "object" && food.restaurant !== null
      ? (food.restaurant as IRestaurant).name
      : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black"
        >
          <FaTimes />
        </button>

        {/* Image */}
        <div className="relative h-64 w-full bg-gray-100">
          <img
            src={imgSrc}
            alt={food.name}
            onError={() => setImgSrc(DEFAULT_FOOD_IMAGE)}
            className="h-full w-full object-cover"
          />

          <span
            className={`absolute left-4 top-4 rounded-full px-3.5 py-1 text-xs font-bold text-white shadow ${
              food.isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {food.isAvailable ? "Available" : "Sold Out"}
          </span>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                {food.category}
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
                {food.name}
              </h2>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-orange-50 px-3 py-1.5 font-bold text-orange-600 border border-orange-200">
              <FaStar className="text-sm" />
              <span>{food.averageRating > 0 ? food.averageRating.toFixed(1) : "New"}</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {food.description}
          </p>

          {restaurantName && (
            <p className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border">
              <FaUtensils className="text-orange-500" />
              <span>Restaurant: <strong>{restaurantName}</strong></span>
            </p>
          )}

          {/* Footer Action */}
          <div className="mt-6 flex items-center justify-between border-t pt-5">
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-2xl font-black text-orange-500">₹{food.price}</p>
            </div>

            <button
              onClick={() => {
                if (onAddToCart) {
                  onAddToCart(food);
                } else {
                  addItem(food._id, 1, food.name);
                }
                onClose();
              }}
              disabled={!food.isAvailable}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition ${
                food.isAvailable
                  ? "bg-orange-500 hover:bg-orange-600 active:scale-95 shadow-md"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <FaPlus /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetailModal;
