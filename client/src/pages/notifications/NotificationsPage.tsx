import { useState, useEffect, useCallback } from "react";
import {
  FaBell,
  FaEnvelope,
  FaCheckCircle,
  FaBoxOpen,
  FaTrash,
  FaCheck,
  FaRedo,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { useRealtime } from "../../hooks/useRealtime";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type INotificationItem,
} from "../../services/notificationService";

function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const { latestNotification, refreshUnreadNotifications } = useRealtime();
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await getMyNotifications();
      setNotifications(data || []);
    } catch (err: unknown) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!latestNotification) return;
    setNotifications((current) => [
      latestNotification,
      ...current.filter((item) => item._id !== latestNotification._id),
    ]);
  }, [latestNotification]);

  const handleMarkOneRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      void refreshUnreadNotifications();
      toast.success("Notification marked as read");
    } catch (err: unknown) {
      console.error("Error marking read:", err);
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      void refreshUnreadNotifications();
      toast.success("All notifications marked as read");
    } catch (err: unknown) {
      console.error("Error marking all read:", err);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      void refreshUnreadNotifications();
      toast.success("Notification deleted");
    } catch (err: unknown) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <FaBell className="text-orange-500" /> Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Stay updated on order status, delivery progress, and account updates
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotifications}
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-orange-50"
            >
              <FaRedo /> Refresh
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-600"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 font-medium text-gray-600">Fetching notifications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <FaBell size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No Notifications Yet</h2>
            <p className="mt-2 text-xs text-gray-500">
              When your order status updates or system events occur, alerts will appear here.
            </p>
          </div>
        )}

        {/* Notifications Feed */}
        {!loading && notifications.length > 0 && (
          <div className="rounded-3xl bg-white p-6 shadow-sm border space-y-4">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`flex items-start justify-between gap-4 rounded-2xl p-4 transition ${
                  item.isRead
                    ? "bg-gray-50/60 border border-gray-100"
                    : "bg-orange-50/40 border border-orange-200"
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
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] font-semibold text-gray-400 mt-2 block">
                      {new Date(item.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkOneRead(item._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200"
                      title="Mark as read"
                    >
                      <FaCheck size={12} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    title="Delete notification"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
