import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaRedo, FaUtensils } from "react-icons/fa";
import RestaurantCard from "../../components/home/RestaurantCard";
import {
  getAllRestaurants,
  searchRestaurants,
  getRestaurantsByCategory,
} from "../../services/restaurantService";
import type { IRestaurant } from "../../types/food";

const CATEGORIES = [
  "All",
  "Pizza",
  "Burger",
  "Chicken",
  "Salad",
  "Dessert",
  "Drinks",
  "Indian",
  "Chinese",
];

function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const fetchRestaurantsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: IRestaurant[] = [];

      if (searchQuery.trim()) {
        data = await searchRestaurants(searchQuery.trim());
      } else if (selectedCategory && selectedCategory !== "All") {
        data = await getRestaurantsByCategory(selectedCategory);
      } else {
        data = await getAllRestaurants();
      }

      setRestaurants(data);
    } catch (err: unknown) {
      console.error("Error loading restaurants:", err);
      setError(
        "Failed to load restaurants. The backend server might be starting up (Render cold start takes ~50s)."
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchRestaurantsData();
  }, [fetchRestaurantsData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedCategory && selectedCategory !== "All")
      params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const params: Record<string, string> = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (cat !== "All") params.category = cat;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Explore Restaurants 🍽️
          </h1>
          <p className="mt-2 text-gray-600">
            Discover top-rated restaurants, cuisines, and fast delivery options near you.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 items-center rounded-xl bg-white p-2 shadow-sm border"
          >
            <FaSearch className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurant by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-gray-700 outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-5 py-2 font-medium text-white hover:bg-orange-600"
            >
              Search
            </button>
          </form>

          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100"
            >
              <FaRedo /> Reset Filters
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-orange-50 border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-700">
              Fetching restaurants...
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Note: Render backend cold start may take up to 50 seconds on first request.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg border border-red-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Unable to Load Restaurants
            </h3>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              onClick={fetchRestaurantsData}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              <FaRedo /> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && restaurants.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border shadow-sm p-8">
            <FaUtensils className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">
              No Restaurants Found
            </h3>
            <p className="mt-2 text-gray-500">
              {searchQuery || selectedCategory !== "All"
                ? `No restaurants match "${searchQuery || selectedCategory}". Try clearing your filters.`
                : "No restaurants are available in the database currently."}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={handleReset}
                className="mt-6 rounded-xl bg-orange-500 px-6 py-2.5 font-medium text-white hover:bg-orange-600"
              >
                Show All Restaurants
              </button>
            )}
          </div>
        )}

        {/* Restaurant Grid */}
        {!loading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantsPage;
