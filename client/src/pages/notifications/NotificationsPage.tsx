import { useState } from "react";
import {
  FaBell,
  FaEnvelope,
  FaCheckCircle,
  FaBoxOpen,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import {
  sendWelcomeNotification,
  sendOrderPlacedNotification,
  sendDeliveredNotification,
  sendPaymentNotification,
} from "../../services/notificationService";

interface NotificationItem {
  id: string;
  type: "ORDER" | "DELIVERY" | "PAYMENT" | "SYSTEM";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function NotificationsPage() {
  const { user, isAdmin } = useAuth();
  const [sending, setSending] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      type: "ORDER",
      title: "Order Placed Successfully 🛍️",
      message: "Your food order #ORD-8F92A1 has been placed and is being confirmed.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: "2",
      type: "PAYMENT",
      title: "Payment Confirmed 💳",
      message: "Payment of ₹450 received successfully.",
      time: "12 mins ago",
      read: false,
    },
    {
      id: "3",
      type: "DELIVERY",
      title: "Order Delivered 🚚",
      message: "Your meal has been delivered to your saved home address.",
      time: "2 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "SYSTEM",
      title: "Welcome to Foodie 🎉",
      message: "Thank you for registering! Enjoy exclusive discounts on your first order.",
      time: "1 day ago",
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleTestNotification = async (type: string) => {
    if (!user?.email) {
      toast.error("User email is required");
      return;
    }

    try {
      setSending(true);
      if (type === "welcome") {
        await sendWelcomeNotification(user.email, user.name || "Customer");
        toast.success(`Welcome email notification sent to ${user.email}!`);
      } else if (type === "order") {
        await sendOrderPlacedNotification(user.email, "ORD-DEMO-1001");
        toast.success(`Order confirmation email sent to ${user.email}!`);
      } else if (type === "delivered") {
        await sendDeliveredNotification(user.email, "ORD-DEMO-1001");
        toast.success(`Delivery notification email sent to ${user.email}!`);
      } else if (type === "payment") {
        await sendPaymentNotification(user.email, 450);
        toast.success(`Payment receipt email sent to ${user.email}!`);
      }
    } catch (err: unknown) {
      console.error("Error triggering notification:", err);
      toast.error("Failed to send notification email (Admin permissions required)");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <FaBell className="text-orange-500" /> Notification Center
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Stay updated on order status, delivery progress, and account updates
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="rounded-xl border bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-orange-50"
          >
            Mark All as Read
          </button>
        </div>

        {/* Admin Test Dispatcher Box */}
        {isAdmin && (
          <div className="rounded-3xl bg-orange-500 p-6 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <FaPaperPlane className="text-xl" />
              <h3 className="font-bold text-lg">Admin Notification Test Console</h3>
            </div>
            <p className="text-xs opacity-90">
              Test sending transactional notification emails to <strong>{user?.email}</strong>.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleTestNotification("welcome")}
                disabled={sending}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 shadow"
              >
                Send Welcome Email
              </button>
              <button
                onClick={() => handleTestNotification("order")}
                disabled={sending}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 shadow"
              >
                Send Order Placed Email
              </button>
              <button
                onClick={() => handleTestNotification("delivered")}
                disabled={sending}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 shadow"
              >
                Send Delivery Email
              </button>
              <button
                onClick={() => handleTestNotification("payment")}
                disabled={sending}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 shadow"
              >
                Send Payment Receipt
              </button>
            </div>
          </div>
        )}

        {/* Notifications Feed */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-4 rounded-2xl p-4 transition ${
                item.read ? "bg-gray-50/60 border border-gray-100" : "bg-orange-50/40 border border-orange-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 flex-shrink-0 mt-0.5">
                  {item.type === "ORDER" && <FaBoxOpen />}
                  {item.type === "DELIVERY" && <FaCheckCircle />}
                  {item.type === "PAYMENT" && <FaBell />}
                  {item.type === "SYSTEM" && <FaEnvelope />}
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] font-semibold text-gray-400 mt-2 block">
                    {item.time}
                  </span>
                </div>
              </div>

              {!item.read && (
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500 flex-shrink-0"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
