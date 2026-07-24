import { useState, useEffect, useCallback } from "react";
import {
  FaUserShield,
  FaShoppingBag,
  FaTag,
  FaCreditCard,
  FaStar,
  FaChartLine,
  FaRedo,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

import type { IOrder, ICoupon, IPayment, IReview, IUser } from "../../types/food";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { getCoupons, createCoupon, deleteCoupon } from "../../services/couponService";
import { getAllPayments } from "../../services/paymentService";
import { getMyReviews } from "../../services/reviewService";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "coupons" | "payments" | "reviews"
  >("overview");

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const [loading, setLoading] = useState(true);

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newDiscountType, setNewDiscountType] = useState<"flat" | "percentage">("flat");
  const [newDiscountValue, setNewDiscountValue] = useState<number>(50);
  const [newMinOrderAmount, setNewMinOrderAmount] = useState<number>(200);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersData, couponsData, paymentsData, reviewsData] =
        await Promise.allSettled([
          getAllOrders(),
          getCoupons(),
          getAllPayments(),
          getMyReviews(),
        ]);

      if (ordersData.status === "fulfilled") setOrders(ordersData.value);
      if (couponsData.status === "fulfilled") setCoupons(couponsData.value);
      if (paymentsData.status === "fulfilled") setPayments(paymentsData.value);
      if (reviewsData.status === "fulfilled") setReviews(reviewsData.value);
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

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      toast.error("Please enter a valid coupon code");
      return;
    }

    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30); // 30 days default

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
              <h1 className="text-3xl font-black">Admin Management Control</h1>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Live platform analytics, order state transitions, and system controls.
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
            { id: "overview", label: "Analytics Overview", icon: FaChartLine },
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Total Platform Revenue
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-600 font-bold">
                  ₹
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-black text-gray-900">₹{totalRevenue}</h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Total Orders Placed
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 font-bold">
                  <FaShoppingBag />
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-black text-gray-900">{orders.length}</h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Active Coupons
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold">
                  <FaTag />
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-black text-gray-900">{coupons.length}</h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Logged Transactions
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 font-bold">
                  <FaCreditCard />
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-black text-gray-900">{payments.length}</h2>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {!loading && activeTab === "orders" && (
          <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-4">
              All Customer Orders ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">No orders logged in system.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50 font-medium">
                        <td className="p-3 font-bold">
                          #{o._id.substring(o._id.length - 8).toUpperCase()}
                        </td>
                        <td className="p-3 font-semibold">
                          {typeof o.user === "object" && o.user !== null
                            ? (o.user as IUser).name
                            : "Customer"}
                        </td>
                        <td className="p-3 font-bold text-orange-500">₹{o.totalAmount}</td>
                        <td className="p-3">{o.paymentMethod} ({o.paymentStatus})</td>
                        <td className="p-3 font-bold text-blue-600">{o.orderStatus}</td>
                        <td className="p-3 text-right">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                            className="rounded-lg border px-2 py-1 text-xs font-bold text-gray-800 outline-none focus:border-orange-500"
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
            )}
          </div>
        )}

        {/* TAB 3: COUPONS CONTROL */}
        {!loading && activeTab === "coupons" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Create Coupon Form */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
                Create New Promo Coupon
              </h3>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SAVE20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 uppercase font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border px-3 py-2 font-semibold outline-none focus:border-orange-500"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Discount Value ({newDiscountType === "flat" ? "₹" : "%"})
                  </label>
                  <input
                    type="number"
                    value={newDiscountValue}
                    onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                    className="w-full rounded-xl border px-3 py-2 font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Min Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newMinOrderAmount}
                    onChange={(e) => setNewMinOrderAmount(Number(e.target.value))}
                    className="w-full rounded-xl border px-3 py-2 font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white shadow hover:bg-orange-600"
                >
                  <FaPlus className="inline mr-1" /> Create Coupon
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
                Active System Coupons ({coupons.length})
              </h3>

              {coupons.length === 0 ? (
                <p className="text-xs text-gray-500">No coupons created yet.</p>
              ) : (
                <div className="space-y-3">
                  {coupons.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-center justify-between rounded-2xl bg-orange-50/50 p-4 border border-orange-100 text-xs"
                    >
                      <div>
                        <span className="font-black text-orange-600 text-sm">
                          {c.code}
                        </span>
                        <p className="text-gray-600 mt-0.5">
                          Discount:{" "}
                          <strong>
                            {c.discountType === "percentage"
                              ? `${c.discountValue}%`
                              : `₹${c.discountValue}`}
                          </strong>{" "}
                          (Min order: ₹{c.minOrderAmount})
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteCoupon(c._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-red-500 border shadow-sm hover:bg-red-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
