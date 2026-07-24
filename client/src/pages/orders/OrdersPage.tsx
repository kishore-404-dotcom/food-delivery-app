import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
  FaRedo,
  FaArrowRight,
  FaTimes,
  FaReceipt,
  FaInfoCircle,
} from "react-icons/fa";
import { getMyOrders } from "../../services/orderService";
import type { IOrder, IAddress } from "../../types/food";

function getStatusBadge(status: string) {
  switch (status) {
    case "DELIVERED":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          ● Delivered
        </span>
      );
    case "OUT_FOR_DELIVERY":
      return (
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          🛵 Out For Delivery
        </span>
      );
    case "PREPARING":
      return (
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
          🍳 Preparing
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          ✓ Confirmed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
          ✕ Cancelled
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
          🕒 Placed
        </span>
      );
  }
}

function OrderDetailModal({
  order,
  onClose,
}: {
  order: IOrder | null;
  onClose: () => void;
}) {
  if (!order) return null;

  const address =
    typeof order.deliveryAddress === "object" && order.deliveryAddress !== null
      ? (order.deliveryAddress as IAddress)
      : null;

  const dateValue = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = dateValue.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-6"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <FaReceipt className="text-orange-500 text-xl" />
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                Order #{order._id.substring(order._id.length - 8).toUpperCase()}
              </h3>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Status Badge & Payment Method */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border">
          <div>
            <p className="text-xs text-gray-400 font-medium">Order Status</p>
            <div className="mt-1">{getStatusBadge(order.orderStatus)}</div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">Payment Method</p>
            <p className="text-xs font-bold text-gray-800 mt-1">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
            </p>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-orange-500" /> Delivery Address
          </h4>
          {address ? (
            <div className="rounded-2xl bg-orange-50/40 p-4 border border-orange-100 text-xs space-y-1">
              <p className="font-bold text-gray-900">{address.fullName} (📞 {address.phone})</p>
              <p className="text-gray-700">
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ""}
              </p>
              <p className="text-gray-700">
                {address.city}, {address.state} - {address.postalCode}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">Address on record</p>
          )}
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Items Ordered
          </h4>
          <div className="space-y-2 border-t pt-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <span className="font-bold text-gray-900">{item.name}</span>
                  <p className="text-gray-400">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <span className="font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="border-t pt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">Total Paid Amount</span>
          <span className="text-2xl font-black text-orange-500">₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onSelectOrder,
}: {
  order: IOrder;
  onSelectOrder: (order: IOrder) => void;
}) {
  const address =
    typeof order.deliveryAddress === "object" && order.deliveryAddress !== null
      ? (order.deliveryAddress as IAddress)
      : null;

  const dateValue = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = dateValue.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Order ID:</span>
            <span className="font-extrabold text-gray-900">
              #{order._id.substring(order._id.length - 8).toUpperCase()}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <FaCalendarAlt className="text-orange-400" /> {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(order.orderStatus)}

          <button
            onClick={() => onSelectOrder(order)}
            className="flex items-center gap-1 rounded-xl border border-orange-500 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 hover:bg-orange-100"
          >
            <FaInfoCircle /> Details
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-500">{item.quantity}x</span>
              <span className="font-semibold text-gray-800">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:justify-between border-t text-xs">
        {/* Address */}
        {address ? (
          <div className="flex items-start gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-orange-500 mt-0.5" />
            <div>
              <p className="font-bold text-gray-800">{address.fullName}</p>
              <p className="text-gray-500">
                {address.addressLine1}, {address.city} - {address.postalCode}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Delivery Address On Record</span>
        )}

        {/* Total & Payment Method */}
        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <span className="flex items-center gap-1 font-bold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border">
            {order.paymentMethod === "COD" ? (
              <><FaMoneyBillWave className="text-green-500" /> Cash on Delivery</>
            ) : (
              <><FaCreditCard className="text-blue-500" /> Online Payment</>
            )}
          </span>

          <div className="text-right">
            <p className="text-xs text-gray-400">Total Paid</p>
            <p className="text-xl font-extrabold text-orange-500">₹{order.totalAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyOrders();
      setOrders(data);
    } catch (err: unknown) {
      console.error("Failed to load user orders:", err);
      setError("Failed to fetch order history. The server might be starting up.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Orders 📦
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and view all your food delivery orders
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-orange-50 transition"
          >
            <FaRedo /> Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-600">Fetching order history...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl bg-red-50 p-8 text-center text-red-600 border border-red-100">
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow"
            >
              <FaRedo /> Retry Now
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <FaShoppingBag size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No Orders Placed Yet</h2>
            <p className="mt-2 text-gray-500">
              When you order food, your past and active orders will appear here.
            </p>
            <Link
              to="/foods"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 shadow"
            >
              Order Food Now <FaArrowRight />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onSelectOrder={(ord) => setSelectedOrder(ord)}
              />
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
}

export default OrdersPage;
