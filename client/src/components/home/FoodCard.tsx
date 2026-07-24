import { useState } from "react";
import { FaStar, FaPlus, FaUtensils } from "react-icons/fa";
import type { IFood, IRestaurant } from "../../types/food";

interface FoodCardProps {
  food: IFood;
  onSelect?: (food: IFood) => void;
  onAddToCart?: (food: IFood) => void;
}

const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

function FoodCard({ food, onSelect, onAddToCart }: FoodCardProps) {
  const [imgSrc, setImgSrc] = useState(food.image || DEFAULT_FOOD_IMAGE);

  const restaurantName =
    typeof food.restaurant === "object" && food.restaurant !== null
      ? (food.restaurant as IRestaurant).name
      : null;

  return (
    <div
      onClick={() => onSelect && onSelect(food)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl cursor-pointer border"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={food.name}
          onError={() => setImgSrc(DEFAULT_FOOD_IMAGE)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Availability Badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
            food.isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {food.isAvailable ? "Available" : "Sold Out"}
        </span>

        {/* Category Badge */}
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {food.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500">
            {food.name}
          </h3>

          <div className="flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">
            <FaStar className="text-xs" />
            <span>{food.averageRating > 0 ? food.averageRating.toFixed(1) : "New"}</span>
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {food.description}
        </p>

        {restaurantName && (
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-400">
            <FaUtensils className="text-xs text-orange-400" />
            <span>{restaurantName}</span>
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-xl font-extrabold text-orange-500">
            ₹{food.price}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart(food);
            }}
            disabled={!food.isAvailable}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              food.isAvailable
                ? "bg-orange-500 hover:bg-orange-600 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaPlus className="text-xs" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
