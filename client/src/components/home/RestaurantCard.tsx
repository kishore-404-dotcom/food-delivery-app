import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaClock, FaMotorcycle } from "react-icons/fa";
import type { IRestaurant } from "../../types/food";

interface RestaurantCardProps {
  restaurant: IRestaurant;
}

// Fallback SVG data URL for missing or broken images
const DEFAULT_RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [imgSrc, setImgSrc] = useState(
    restaurant.image || DEFAULT_RESTAURANT_IMAGE
  );

  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={restaurant.name}
          onError={() => setImgSrc(DEFAULT_RESTAURANT_IMAGE)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Status Badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
            restaurant.isOpen ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {restaurant.isOpen ? "Open Now" : "Closed"}
        </span>

        {/* Category Badge */}
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {restaurant.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-1 text-sm font-bold text-orange-600">
            <FaStar className="text-xs" />
            <span>{restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"}</span>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {restaurant.description}
        </p>

        <p className="mt-1 text-xs text-gray-400">📍 {restaurant.address}</p>

        <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-1">
            <FaClock className="text-gray-400" />
            <span>{restaurant.deliveryTime} mins</span>
          </div>

          <div className="flex items-center gap-1">
            <FaMotorcycle className="text-gray-400" />
            <span>
              {restaurant.deliveryFee === 0
                ? "Free Delivery"
                : `₹${restaurant.deliveryFee} Delivery`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;
