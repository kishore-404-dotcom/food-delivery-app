import { useState, useEffect, useCallback } from "react";
import { FaRedo, FaUtensils } from "react-icons/fa";
import FoodCard from "./FoodCard";
import FoodDetailModal from "./FoodDetailModal";
import { getFoods } from "../../services/foodService";
import type { IFood } from "../../types/food";
import { useCart } from "../../hooks/useCart";

function FoodGrid() {
  const { addItem } = useCart();
  const [foods, setFoods] = useState<IFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<IFood | null>(null);

  const fetchFoodsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFoods();
      setFoods(data);
    } catch (err: unknown) {
      console.error("Error loading foods:", err);
      setError(
        "Failed to load food menu. Server might be waking up from Render cold start (~50s)."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoodsData();
  }, [fetchFoodsData]);

  const handleAddToCart = async (food: IFood) => {
    await addItem(food._id, 1, food.name);
  };

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Popular Foods 🍔
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Explore delicious dishes from top rated kitchens
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 font-medium text-gray-700">Loading food menu...</p>
          <p className="mt-1 text-xs text-gray-400">
            Note: Render server cold starts may take up to 50 seconds on initial load.
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md border border-red-100">
          <p className="text-3xl mb-2">⚠️</p>
          <h3 className="text-lg font-bold text-gray-900">Unable to Fetch Menu</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={fetchFoodsData}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
          >
            <FaRedo /> Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && foods.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl border p-8 shadow-sm">
          <FaUtensils className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No Food Items Available</h3>
          <p className="mt-2 text-gray-500">
            No dishes have been added to the menu yet. Check back soon!
          </p>
        </div>
      )}

      {/* Food Grid */}
      {!loading && !error && foods.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onSelect={(item) => setSelectedFood(item)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </section>
  );
}

export default FoodGrid;
