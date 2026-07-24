import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaStore,
  FaTrash,
  FaUtensils,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import { useRealtime } from "../../hooks/useRealtime";
import type { IFood, IOrder, IRestaurant } from "../../types/food";
import {
  createRestaurant,
  getMyRestaurant,
  updateRestaurant,
} from "../../services/restaurantService";
import {
  createFood,
  deleteFood,
  getMyFoods,
  updateFood,
} from "../../services/foodService";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../services/orderService";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const FALLBACK_RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";
const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
};

const validateImage = (file: File): string => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, and WEBP images are allowed.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must not exceed 5 MB.";
  }
  return "";
};

const nextStatuses: Record<IOrder["orderStatus"], IOrder["orderStatus"][]> = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

function RestaurantDashboard() {
  const { user } = useAuth();
  const { latestCreatedOrder, latestUpdatedOrder } = useRealtime();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [foods, setFoods] = useState<IFood[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRestaurant, setSavingRestaurant] = useState(false);
  const [savingFood, setSavingFood] = useState(false);

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantCategory, setRestaurantCategory] = useState("General");
  const [restaurantImage, setRestaurantImage] = useState<File | null>(null);
  const [restaurantPreview, setRestaurantPreview] = useState("");
  const [restaurantImageError, setRestaurantImageError] = useState("");

  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodCategory, setFoodCategory] = useState("Main Course");
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [foodPreview, setFoodPreview] = useState("");
  const [foodImageError, setFoodImageError] = useState("");

  const loadDashboard = useCallback(async () => {
    if (user?.restaurantStatus !== "approved") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const ownedRestaurant = await getMyRestaurant();
      setRestaurant(ownedRestaurant);

      if (ownedRestaurant) {
        setRestaurantName(ownedRestaurant.name);
        setRestaurantDescription(ownedRestaurant.description);
        setRestaurantAddress(ownedRestaurant.address);
        setRestaurantCategory(ownedRestaurant.category);
        setRestaurantPreview(ownedRestaurant.image || "");
      }

      const [ownedFoods, restaurantOrders] = await Promise.all([
        getMyFoods(),
        getRestaurantOrders(),
      ]);
      setFoods(ownedFoods);
      setOrders(restaurantOrders);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantStatus]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (latestCreatedOrder || latestUpdatedOrder) {
      void loadDashboard();
    }
  }, [latestCreatedOrder, latestUpdatedOrder, loadDashboard]);

  useEffect(
    () => () => {
      if (restaurantPreview.startsWith("blob:")) {
        URL.revokeObjectURL(restaurantPreview);
      }
      if (foodPreview.startsWith("blob:")) {
        URL.revokeObjectURL(foodPreview);
      }
    },
    [foodPreview, restaurantPreview]
  );

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.orderStatus !== "CANCELLED")
        .reduce((sum, order) => sum + order.totalAmount, 0),
    [orders]
  );

  const handleRestaurantImage = (file?: File) => {
    if (!file) return;
    const validationError = validateImage(file);
    setRestaurantImageError(validationError);
    if (validationError) {
      setRestaurantImage(null);
      return;
    }
    if (restaurantPreview.startsWith("blob:")) {
      URL.revokeObjectURL(restaurantPreview);
    }
    setRestaurantImage(file);
    setRestaurantPreview(URL.createObjectURL(file));
  };

  const handleFoodImage = (file?: File) => {
    if (!file) return;
    const validationError = validateImage(file);
    setFoodImageError(validationError);
    if (validationError) {
      setFoodImage(null);
      return;
    }
    if (foodPreview.startsWith("blob:")) {
      URL.revokeObjectURL(foodPreview);
    }
    setFoodImage(file);
    setFoodPreview(URL.createObjectURL(file));
  };

  const saveRestaurant = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!restaurantName.trim() || !restaurantAddress.trim()) {
      toast.error("Restaurant name and address are required");
      return;
    }
    if (restaurantImageError) return;

    const formData = new FormData();
    formData.append("name", restaurantName.trim());
    formData.append(
      "description",
      restaurantDescription.trim() || restaurantName.trim()
    );
    formData.append("address", restaurantAddress.trim());
    formData.append("category", restaurantCategory.trim() || "General");
    formData.append("deliveryTime", String(restaurant?.deliveryTime || 30));
    formData.append("deliveryFee", String(restaurant?.deliveryFee || 0));
    if (restaurantImage) formData.append("image", restaurantImage);

    try {
      setSavingRestaurant(true);
      const saved = restaurant
        ? await updateRestaurant(restaurant._id, formData)
        : await createRestaurant(formData);
      setRestaurant(saved);
      setRestaurantImage(null);
      setRestaurantPreview(saved.image || "");
      toast.success(restaurant ? "Restaurant updated" : "Restaurant created");
      await loadDashboard();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingRestaurant(false);
    }
  };

  const saveFood = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!restaurant) {
      toast.error("Create your restaurant before adding menu items");
      return;
    }
    const parsedPrice = Number(foodPrice);
    if (!foodName.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast.error("Enter a food name and a valid price");
      return;
    }
    if (foodImageError) return;

    const formData = new FormData();
    formData.append("name", foodName.trim());
    formData.append("description", foodDescription.trim() || foodName.trim());
    formData.append("price", String(parsedPrice));
    formData.append("category", foodCategory.trim() || "Main Course");
    formData.append("restaurant", restaurant._id);
    if (foodImage) formData.append("image", foodImage);

    try {
      setSavingFood(true);
      await createFood(formData);
      setFoodName("");
      setFoodDescription("");
      setFoodPrice("");
      setFoodImage(null);
      setFoodPreview("");
      toast.success("Menu item added");
      await loadDashboard();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingFood(false);
    }
  };

  const toggleFoodAvailability = async (food: IFood) => {
    try {
      await updateFood(food._id, { isAvailable: !food.isAvailable });
      await loadDashboard();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const removeFood = async (food: IFood) => {
    if (!window.confirm(`Remove ${food.name} from the menu?`)) return;
    try {
      await deleteFood(food._id);
      toast.success("Menu item removed");
      await loadDashboard();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const changeOrderStatus = async (
    orderId: string,
    status: IOrder["orderStatus"]
  ) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Order status updated");
      await loadDashboard();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (user?.restaurantStatus !== "approved") {
    const rejected = user?.restaurantStatus === "rejected";
    return (
      <main className="min-h-[calc(100vh-80px)] bg-orange-50 px-4 py-16">
        <section className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
          {rejected ? (
            <FaStore className="mx-auto mb-5 text-6xl text-red-400" />
          ) : (
            <FaClock className="mx-auto mb-5 text-6xl text-orange-500" />
          )}
          <h1 className="text-3xl font-black text-gray-900">
            {rejected ? "Restaurant Application Rejected" : "Approval Pending"}
          </h1>
          <p className="mt-4 text-gray-600">
            {rejected
              ? "Your restaurant partner application was not approved. Contact the platform administrator for assistance."
              : "Your restaurant partner account is waiting for administrator approval. Refresh this page after approval to open your dashboard."}
          </p>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
          role="status"
          aria-label="Loading restaurant dashboard"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="font-semibold text-orange-500">Restaurant Partner</p>
          <h1 className="text-3xl font-black text-gray-900">
            Welcome, {user?.name}
          </h1>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Menu Items", value: foods.length, icon: FaUtensils },
            { label: "Orders", value: orders.length, icon: FaBoxOpen },
            {
              label: "Order Value",
              value: `₹${revenue.toFixed(2)}`,
              icon: FaCheckCircle,
            },
          ].map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-2xl bg-white p-6 shadow-sm">
              <Icon className="mb-3 text-2xl text-orange-500" />
              <p className="text-sm font-semibold text-gray-500">{label}</p>
              <p className="mt-1 text-3xl font-black text-gray-900">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <form
            onSubmit={saveRestaurant}
            className="space-y-4 rounded-3xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-black text-gray-900">
              {restaurant ? "Restaurant Details" : "Create Your Restaurant"}
            </h2>
            <input
              value={restaurantName}
              onChange={(event) => setRestaurantName(event.target.value)}
              placeholder="Restaurant name"
              className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
            />
            <textarea
              value={restaurantDescription}
              onChange={(event) => setRestaurantDescription(event.target.value)}
              placeholder="Description"
              className="min-h-24 w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
            />
            <input
              value={restaurantAddress}
              onChange={(event) => setRestaurantAddress(event.target.value)}
              placeholder="Restaurant address"
              className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
            />
            <input
              value={restaurantCategory}
              onChange={(event) => setRestaurantCategory(event.target.value)}
              placeholder="Category"
              className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleRestaurantImage(event.target.files?.[0])}
              className="w-full text-sm"
            />
            {restaurantImageError && (
              <p role="alert" className="text-sm font-semibold text-red-600">
                {restaurantImageError}
              </p>
            )}
            <img
              src={restaurantPreview || FALLBACK_RESTAURANT_IMAGE}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_RESTAURANT_IMAGE;
              }}
              alt="Restaurant preview"
              className="h-44 w-full rounded-2xl object-cover"
            />
            <button
              type="submit"
              disabled={savingRestaurant}
              className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:bg-orange-300"
            >
              {savingRestaurant ? "Saving..." : "Save Restaurant"}
            </button>
          </form>

          <div className="space-y-6">
            <form
              onSubmit={saveFood}
              className="space-y-4 rounded-3xl bg-white p-6 shadow-sm"
            >
              <h2 className="flex items-center gap-2 text-xl font-black">
                <FaPlus className="text-orange-500" /> Add Menu Item
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={foodName}
                  onChange={(event) => setFoodName(event.target.value)}
                  placeholder="Food name"
                  className="rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
                />
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={foodPrice}
                  onChange={(event) => setFoodPrice(event.target.value)}
                  placeholder="Price"
                  className="rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <input
                value={foodDescription}
                onChange={(event) => setFoodDescription(event.target.value)}
                placeholder="Description"
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              />
              <input
                value={foodCategory}
                onChange={(event) => setFoodCategory(event.target.value)}
                placeholder="Category"
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => handleFoodImage(event.target.files?.[0])}
                className="w-full text-sm"
              />
              {foodImageError && (
                <p role="alert" className="text-sm font-semibold text-red-600">
                  {foodImageError}
                </p>
              )}
              {foodPreview && (
                <img
                  src={foodPreview}
                  alt="Food preview"
                  className="h-36 w-full rounded-2xl object-cover"
                />
              )}
              <button
                type="submit"
                disabled={!restaurant || savingFood}
                className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:bg-gray-300"
              >
                {savingFood ? "Adding..." : "Add Food"}
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-black">Your Menu</h2>
          {foods.length === 0 ? (
            <p className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              No menu items yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {foods.map((food) => (
                <article key={food._id} className="overflow-hidden rounded-2xl border">
                  <img
                    src={food.image || FALLBACK_FOOD_IMAGE}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_FOOD_IMAGE;
                    }}
                    alt={food.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">{food.name}</h3>
                        <p className="text-orange-600">₹{food.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFood(food)}
                        aria-label={`Delete ${food.name}`}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFoodAvailability(food)}
                      className={`w-full rounded-lg py-2 text-sm font-bold ${
                        food.isAvailable
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {food.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-black">Restaurant Orders</h2>
          {orders.length === 0 ? (
            <p className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              No orders received yet.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="grid gap-4 rounded-2xl border p-5 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="mt-1 font-bold text-gray-900">
                      {order.items
                        .map((item) => `${item.name} × ${item.quantity}`)
                        .join(", ")}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      ₹{order.totalAmount.toFixed(2)} · {order.paymentMethod} ·{" "}
                      {order.paymentStatus}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nextStatuses[order.orderStatus].length === 0 ? (
                      <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">
                        {order.orderStatus.replaceAll("_", " ")}
                      </span>
                    ) : (
                      nextStatuses[order.orderStatus].map((status) => (
                        <button
                          type="button"
                          key={status}
                          onClick={() => changeOrderStatus(order._id, status)}
                          className={`rounded-xl px-4 py-2 text-sm font-bold ${
                            status === "CANCELLED"
                              ? "bg-red-50 text-red-700"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {status.replaceAll("_", " ")}
                        </button>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default RestaurantDashboard;
