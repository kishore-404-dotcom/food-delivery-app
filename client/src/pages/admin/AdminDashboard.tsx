import { useState, useEffect, useCallback } from "react";
import {
  FaUserShield,
  FaShoppingBag,
  FaUtensils,
  FaTag,
  FaCreditCard,
  FaStar,
  FaChartLine,
  FaRedo,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBoxOpen,
  FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";

import type { IOrder, ICoupon, IPayment, IReview, IRestaurant, IFood, IUser } from "../../types/food";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { getCoupons, createCoupon, deleteCoupon } from "../../services/couponService";
import { getAllPayments } from "../../services/paymentService";
import { getMyReviews } from "../../services/reviewService";
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../../services/restaurantService";
import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../../services/foodService";
import { getDashboardOverview, type DashboardOverview } from "../../services/adminService";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "restaurants" | "foods" | "orders" | "coupons" | "payments" | "reviews"
  >("overview");

  // State
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [foods, setFoods] = useState<IFood[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Restaurant Modal & Form State
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [editingRest, setEditingRest] = useState<IRestaurant | null>(null);
  const [restName, setRestName] = useState("");
  const [restCategory, setRestCategory] = useState("Italian");
  const [restAddress, setRestAddress] = useState("");
  const [restImageFile, setRestImageFile] = useState<File | null>(null);
  const [restImagePreview, setRestImagePreview] = useState<string>("");

  // Food Modal & Form State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<IFood | null>(null);
  const [foodName, setFoodName] = useState("");
  const [foodDesc, setFoodDesc] = useState("");
  const [foodPrice, setFoodPrice] = useState<number>(199);
  const [foodCategory, setFoodCategory] = useState("Main Course");
  const [foodRestId, setFoodRestId] = useState("");
  const [foodImageFile, setFoodImageFile] = useState<File | null>(null);
  const [foodImagePreview, setFoodImagePreview] = useState<string>("");

  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newDiscountType, setNewDiscountType] = useState<"flat" | "percentage">("flat");
  const [newDiscountValue, setNewDiscountValue] = useState<number>(50);
  const [newMinOrderAmount, setNewMinOrderAmount] = useState<number>(200);

  // Order Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        overviewRes,
        restsRes,
        foodsRes,
        ordersRes,
        couponsRes,
        paymentsRes,
        reviewsRes,
      ] = await Promise.allSettled([
        getDashboardOverview(),
        getAllRestaurants(),
        getFoods(),
        getAllOrders(),
        getCoupons(),
        getAllPayments(),
        getMyReviews(),
      ]);

      if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);
      if (restsRes.status === "fulfilled") setRestaurants(restsRes.value);
      if (foodsRes.status === "fulfilled") setFoods(foodsRes.value);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value);
      if (couponsRes.status === "fulfilled") setCoupons(couponsRes.value);
      if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value);
      if (reviewsRes.status === "fulfilled") setReviews(reviewsRes.value);
    } catch (err: unknown) {
      console.error("Error loading admin dashboard data:", err);
      toast.error("Failed to load admin analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // File Validation Helper
  const validateImageFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast.error("Invalid file format. Only JPG, PNG, and WEBP are supported.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Please choose a smaller image.");
      return false;
    }
    return true;
  };

  // RESTAURANT CRUD
  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restName.trim() || !restAddress.trim()) {
      toast.error("Please fill in restaurant name and address");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", restName.trim());
      formData.append("address", restAddress.trim());
      formData.append("category", restCategory);

      if (restImageFile) {
        formData.append("image", restImageFile);
      }

      if (editingRest) {
        await updateRestaurant(editingRest._id, formData);
        toast.success("Restaurant updated!");
      } else {
        await createRestaurant(formData);
        toast.success("Restaurant created!");
      }

      setIsRestModalOpen(false);
      setEditingRest(null);
      setRestName("");
      setRestAddress("");
      setRestImageFile(null);
      setRestImagePreview("");
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error saving restaurant:", err);
      toast.error("Failed to save restaurant to Cloudinary/MongoDB");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this restaurant? This will remove associated Cloudinary media.")) return;
    try {
      await deleteRestaurant(id);
      toast.success("Restaurant deleted!");
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error deleting restaurant:", err);
      toast.error("Failed to delete restaurant");
    }
  };

  // FOOD CRUD
  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !foodRestId) {
      toast.error("Please select a restaurant and food name");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", foodName.trim());
      formData.append("description", foodDesc.trim());
      formData.append("price", String(foodPrice));
      formData.append("category", foodCategory);
      formData.append("restaurant", foodRestId);

      if (foodImageFile) {
        formData.append("image", foodImageFile);
      }

      if (editingFood) {
        await updateFood(editingFood._id, formData);
        toast.success("Food dish updated!");
      } else {
        await createFood(formData);
        toast.success("Food dish created!");
      }

      setIsFoodModalOpen(false);
      setEditingFood(null);
      setFoodName("");
      setFoodDesc("");
      setFoodPrice(199);
      setFoodImageFile(null);
      setFoodImagePreview("");
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error saving food:", err);
      toast.error("Failed to save food dish to Cloudinary/MongoDB");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleFoodAvailability = async (food: IFood) => {
    try {
      await updateFood(food._id, { isAvailable: !food.isAvailable });
      toast.success(`${food.name} availability updated!`);
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error updating food availability:", err);
      toast.error("Failed to update availability");
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this food dish? Cloudinary image will be removed.")) return;
    try {
      await deleteFood(id);
      toast.success("Food dish deleted!");
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error deleting food:", err);
      toast.error("Failed to delete food");
    }
  };

  // ORDER STATUS
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error updating order status:", err);
      toast.error("Invalid status transition according to backend rules");
    }
  };

  // COUPON CRUD
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      toast.error("Please enter a valid coupon code");
      return;
    }

    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      await createCoupon({
        code: newCouponCode.trim().toUpperCase(),
        discountType: newDiscountType,
        discountValue: Number(newDiscountValue),
        minOrderAmount: Number(newMinOrderAmount),
        expiryDate: expiry,
        isActive: true,
      });

      toast.success("Coupon created successfully!");
      setNewCouponCode("");
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error creating coupon:", err);
      toast.error("Failed to create coupon. Code might already exist.");
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCoupon(couponId);
      toast.success("Coupon deleted!");
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Error deleting coupon:", err);
      toast.error("Failed to delete coupon");
    }
  };

  const filteredOrders =
    orderStatusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.orderStatus === orderStatusFilter);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID" || o.orderStatus === "DELIVERED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-gray-900 p-8 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <FaUserShield className="text-orange-500 text-2xl" />
              <h1 className="text-3xl font-black">Admin Control Panel</h1>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Manage platform restaurants, Cloudinary media, live orders, coupons, and analytics.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-white shadow hover:bg-orange-600 transition"
          >
            <FaRedo /> Refresh Data
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b pb-2">
          {[
            { id: "overview", label: "Overview", icon: FaChartLine },
            { id: "restaurants", label: `Restaurants (${restaurants.length})`, icon: FaUtensils },
            { id: "foods", label: `Foods (${foods.length})`, icon: FaBoxOpen },
            { id: "orders", label: `Orders (${orders.length})`, icon: FaShoppingBag },
            { id: "coupons", label: `Coupons (${coupons.length})`, icon: FaTag },
            { id: "payments", label: `Payments (${payments.length})`, icon: FaCreditCard },
            { id: "reviews", label: `Reviews (${reviews.length})`, icon: FaStar },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition whitespace-nowrap ${
                  active
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border"
                }`}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-600">Fetching administrative state...</p>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {!loading && activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue</span>
              <h2 className="mt-2 text-3xl font-black text-green-600">₹{overview?.totalRevenue || totalRevenue}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <span className="text-xs font-bold text-gray-400 uppercase">Restaurants</span>
              <h2 className="mt-2 text-3xl font-black text-gray-900">{overview?.totalRestaurants || restaurants.length}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <span className="text-xs font-bold text-gray-400 uppercase">Food Items</span>
              <h2 className="mt-2 text-3xl font-black text-gray-900">{overview?.totalFoods || foods.length}</h2>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Orders</span>
              <h2 className="mt-2 text-3xl font-black text-orange-500">{overview?.totalOrders || orders.length}</h2>
            </div>
          </div>
        )}

        {/* TAB 2: RESTAURANTS */}
        {!loading && activeTab === "restaurants" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">Manage Restaurants</h3>
              <button
                onClick={() => {
                  setEditingRest(null);
                  setRestName("");
                  setRestCategory("Italian");
                  setRestAddress("");
                  setRestImageFile(null);
                  setRestImagePreview("");
                  setIsRestModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600"
              >
                <FaPlus /> Add Restaurant
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <div key={r._id} className="rounded-2xl border p-4 bg-gray-50 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80"}
                      alt={r.name}
                      className="h-14 w-14 rounded-xl object-cover border"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{r.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{r.address}</p>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {r.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingRest(r);
                        setRestName(r.name);
                        setRestCategory(r.category || "Italian");
                        setRestAddress(r.address);
                        setRestImagePreview(r.image || "");
                        setRestImageFile(null);
                        setIsRestModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteRestaurant(r._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FOODS */}
        {!loading && activeTab === "foods" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">Manage Food Menu</h3>
              <button
                onClick={() => {
                  setEditingFood(null);
                  setFoodName("");
                  setFoodDesc("");
                  setFoodPrice(199);
                  setFoodCategory("Main Course");
                  setFoodRestId(restaurants[0]?._id || "");
                  setFoodImageFile(null);
                  setFoodImagePreview("");
                  setIsFoodModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600"
              >
                <FaPlus /> Add Food Dish
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {foods.map((f) => (
                <div key={f._id} className="rounded-2xl border p-4 bg-gray-50 flex items-start justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"}
                      alt={f.name}
                      className="h-14 w-14 rounded-xl object-cover border"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{f.name}</h4>
                      <p className="text-orange-500 font-bold">₹{f.price}</p>
                      <button
                        onClick={() => handleToggleFoodAvailability(f)}
                        className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          f.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {f.isAvailable ? "Available" : "Sold Out"}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingFood(f);
                        setFoodName(f.name);
                        setFoodDesc(f.description);
                        setFoodPrice(f.price);
                        setFoodCategory(f.category);
                        setFoodRestId(
                          typeof f.restaurant === "object" && f.restaurant !== null
                            ? (f.restaurant as IRestaurant)._id
                            : String(f.restaurant)
                        );
                        setFoodImagePreview(f.image || "");
                        setFoodImageFile(null);
                        setIsFoodModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteFood(f._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {!loading && activeTab === "orders" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Customer Orders ({filteredOrders.length})
              </h3>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="rounded-xl border px-3 py-1.5 text-xs font-bold outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-50 font-bold uppercase">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium">
                  {filteredOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="p-3 font-bold">#{o._id.substring(o._id.length - 8).toUpperCase()}</td>
                      <td className="p-3">{typeof o.user === "object" && o.user ? (o.user as IUser).name : "Customer"}</td>
                      <td className="p-3 font-bold text-orange-500">₹{o.totalAmount}</td>
                      <td className="p-3">{o.paymentMethod}</td>
                      <td className="p-3 font-bold text-blue-600">{o.orderStatus}</td>
                      <td className="p-3 text-right">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                          className="rounded-lg border px-2 py-1 font-bold outline-none"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {!loading && activeTab === "coupons" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <form onSubmit={handleCreateCoupon} className="rounded-3xl bg-white p-6 shadow-sm border space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 border-b pb-2">New Coupon</h3>
              <input
                type="text"
                placeholder="Code (e.g. SAVE20)"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="w-full rounded-xl border p-2 font-bold uppercase"
              />
              <select
                value={newDiscountType}
                onChange={(e) => setNewDiscountType(e.target.value as any)}
                className="w-full rounded-xl border p-2 font-bold"
              >
                <option value="flat">Flat Amount (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
              <input
                type="number"
                placeholder="Discount Value"
                value={newDiscountValue}
                onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                className="w-full rounded-xl border p-2 font-bold"
              />
              <input
                type="number"
                placeholder="Min Order Amount (₹)"
                value={newMinOrderAmount}
                onChange={(e) => setNewMinOrderAmount(Number(e.target.value))}
                className="w-full rounded-xl border p-2 font-bold"
              />
              <button type="submit" className="w-full rounded-xl bg-orange-500 py-2.5 font-bold text-white shadow">
                Create Coupon
              </button>
            </form>

            <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-3 lg:col-span-2 text-xs">
              <h3 className="font-bold text-sm border-b pb-2">Active Coupons</h3>
              {coupons.map((c) => (
                <div key={c._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
                  <div>
                    <span className="font-black text-orange-600 text-sm">{c.code}</span>
                    <p className="text-gray-500">Discount: {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`} (Min: ₹{c.minOrderAmount})</p>
                  </div>
                  <button onClick={() => handleDeleteCoupon(c._id)} className="text-red-500 p-2">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Restaurant Form Modal */}
      {isRestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSaveRestaurant} className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4 text-xs">
            <h3 className="font-bold text-lg">{editingRest ? "Edit Restaurant" : "Add Restaurant"}</h3>
            <input type="text" placeholder="Name *" value={restName} onChange={(e) => setRestName(e.target.value)} className="w-full rounded-xl border p-2 font-bold" />
            <input type="text" placeholder="Address *" value={restAddress} onChange={(e) => setRestAddress(e.target.value)} className="w-full rounded-xl border p-2" />
            <input type="text" placeholder="Category (e.g. Italian)" value={restCategory} onChange={(e) => setRestCategory(e.target.value)} className="w-full rounded-xl border p-2" />
            
            {/* Cloudinary Image File Input */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                <FaImage className="text-orange-500" /> Restaurant Image (Cloudinary)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && validateImageFile(file)) {
                    setRestImageFile(file);
                    setRestImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full rounded-xl border p-2"
              />
              <p className="text-[10px] text-gray-400 mt-1">Accepted: JPG, PNG, WEBP (Max 5MB)</p>

              {restImagePreview && (
                <div className="mt-2 text-center">
                  <img src={restImagePreview} alt="Preview" className="h-24 w-full object-cover rounded-xl border" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsRestModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
              <button type="submit" disabled={uploading} className="px-5 py-2 bg-orange-500 text-white font-bold rounded-xl">
                {uploading ? "Uploading to Cloudinary..." : "Save Restaurant"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Food Form Modal */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSaveFood} className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4 text-xs">
            <h3 className="font-bold text-lg">{editingFood ? "Edit Food Dish" : "Add Food Dish"}</h3>
            <select value={foodRestId} onChange={(e) => setFoodRestId(e.target.value)} className="w-full rounded-xl border p-2 font-bold">
              <option value="">Select Restaurant *</option>
              {restaurants.map((r) => (<option key={r._id} value={r._id}>{r.name}</option>))}
            </select>
            <input type="text" placeholder="Dish Name *" value={foodName} onChange={(e) => setFoodName(e.target.value)} className="w-full rounded-xl border p-2 font-bold" />
            <textarea placeholder="Description" value={foodDesc} onChange={(e) => setFoodDesc(e.target.value)} className="w-full rounded-xl border p-2" />
            <input type="number" placeholder="Price (₹)" value={foodPrice} onChange={(e) => setFoodPrice(Number(e.target.value))} className="w-full rounded-xl border p-2 font-bold" />
            
            {/* Cloudinary Image File Input */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                <FaImage className="text-orange-500" /> Food Image (Cloudinary)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && validateImageFile(file)) {
                    setFoodImageFile(file);
                    setFoodImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full rounded-xl border p-2"
              />
              <p className="text-[10px] text-gray-400 mt-1">Accepted: JPG, PNG, WEBP (Max 5MB)</p>

              {foodImagePreview && (
                <div className="mt-2 text-center">
                  <img src={foodImagePreview} alt="Preview" className="h-24 w-full object-cover rounded-xl border" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsFoodModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
              <button type="submit" disabled={uploading} className="px-5 py-2 bg-orange-500 text-white font-bold rounded-xl">
                {uploading ? "Uploading to Cloudinary..." : "Save Food Dish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
