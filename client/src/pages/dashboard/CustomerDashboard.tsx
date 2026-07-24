import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaHeart,
  FaShoppingBag,
  FaStore,
  FaUser,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { getMyOrders } from "../../services/orderService";
import type { IOrder } from "../../types/food";

function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        setOrders(await getMyOrders());
      } catch {
        setError("We could not load your recent orders.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== "DELIVERED" &&
      order.orderStatus !== "CANCELLED"
  ).length;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white shadow-lg">
          <p className="font-semibold text-orange-100">Customer Dashboard</p>
          <h1 className="mt-1 text-3xl font-black">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-orange-50">
            Track orders and manage your Foodie account from one place.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <FaShoppingBag className="mb-3 text-2xl text-orange-500" />
            <p className="text-sm font-semibold text-gray-500">Total Orders</p>
            <p className="mt-1 text-3xl font-black text-gray-900">
              {loading ? "—" : orders.length}
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <FaStore className="mb-3 text-2xl text-orange-500" />
            <p className="text-sm font-semibold text-gray-500">Active Orders</p>
            <p className="mt-1 text-3xl font-black text-gray-900">
              {loading ? "—" : activeOrders}
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <FaUser className="mb-3 text-2xl text-orange-500" />
            <p className="text-sm font-semibold text-gray-500">Account</p>
            <p className="mt-1 truncate text-lg font-black text-gray-900">
              {user?.email}
            </p>
          </article>
        </section>

        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        <section>
          <h2 className="mb-4 text-2xl font-black text-gray-900">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                to: "/orders",
                label: "My Orders",
                description: "Track current and past orders",
                icon: FaShoppingBag,
              },
              {
                to: "/wishlist",
                label: "Wishlist",
                description: "View saved food items",
                icon: FaHeart,
              },
              {
                to: "/notifications",
                label: "Notifications",
                description: "Read order updates",
                icon: FaBell,
              },
              {
                to: "/profile",
                label: "Profile",
                description: "Manage account details",
                icon: FaUser,
              },
            ].map(({ to, label, description, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >
                <Icon className="mb-3 text-2xl text-orange-500" />
                <h3 className="font-black text-gray-900">{label}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="font-bold text-orange-600">
              View all
            </Link>
          </div>
          {!loading && orders.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <p className="text-gray-500">You have not placed an order yet.</p>
              <Link
                to="/"
                className="mt-4 inline-block rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-white"
              >
                Browse Food
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <Link
                  key={order._id}
                  to="/orders"
                  className="flex flex-col gap-2 rounded-2xl border p-4 transition hover:border-orange-300 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item(s) · ₹{order.totalAmount}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    {order.orderStatus.replaceAll("_", " ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default CustomerDashboard;
