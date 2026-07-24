import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaClock,
  FaMotorcycle,
  FaMapMarkerAlt,
  FaRedo,
} from "react-icons/fa";
import { getRestaurantById } from "../../services/restaurantService";
import type { IRestaurant } from "../../types/food";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGE);

  const fetchRestaurant = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getRestaurantById(id);
      setRestaurant(data);
      setImgSrc(data.image || DEFAULT_IMAGE);
    } catch (err: unknown) {
      console.error("Error fetching restaurant details:", err);
      setError(
        "Restaurant not found or server took too long to respond. Please check the ID or try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <Link
          to="/restaurants"
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 border"
        >
          <FaArrowLeft /> Back to Restaurants
        </Link>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-700">
              Loading restaurant details...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border">
            <div className="mx-auto mb-4 text-4xl">❌</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Restaurant Not Found
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={fetchRestaurant}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-medium text-white hover:bg-orange-600"
              >
                <FaRedo /> Retry
              </button>
              <Link
                to="/restaurants"
                className="rounded-xl border px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                Browse Restaurants
              </Link>
            </div>
          </div>
        )}

        {/* Details Card */}
        {!loading && !error && restaurant && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg border">
            {/* Header Image */}
            <div className="relative h-72 w-full bg-gray-200">
              <img
                src={imgSrc}
                alt={restaurant.name}
                onError={() => setImgSrc(DEFAULT_IMAGE)}
                className="h-full w-full object-cover"
              />

              <span
                className={`absolute left-6 top-6 rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-md ${
                  restaurant.isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {restaurant.isOpen ? "Open Now" : "Closed"}
              </span>

              <span className="absolute right-6 top-6 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                {restaurant.category}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    {restaurant.name}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="text-orange-500" />
                    {restaurant.address}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-2xl bg-orange-100 px-4 py-2 font-bold text-orange-600 sm:self-auto">
                  <FaStar className="text-lg" />
                  <span className="text-xl">
                    {restaurant.rating > 0
                      ? restaurant.rating.toFixed(1)
                      : "New"}
                  </span>
                </div>
              </div>

              <p className="mt-6 text-gray-700 leading-relaxed text-base">
                {restaurant.description}
              </p>

              {/* Delivery Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-orange-50/50 p-6 border border-orange-100 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <FaClock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Estimated Delivery
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {restaurant.deliveryTime} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <FaMotorcycle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Delivery Charge
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {restaurant.deliveryFee === 0
                        ? "Free Delivery"
                        : `₹${restaurant.deliveryFee}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetailPage;
