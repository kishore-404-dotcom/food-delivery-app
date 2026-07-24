import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";

import { useAuth } from "../hooks/useAuth";
import type { IOrder } from "../types/food";
import {
  getMyNotifications,
  type INotificationItem,
} from "../services/notificationService";
import { connectSocket, disconnectSocket } from "../services/socket";

export interface RealtimeContextType {
  socket: Socket | null;
  connected: boolean;
  unreadNotifications: number;
  latestCreatedOrder: IOrder | null;
  latestUpdatedOrder: IOrder | null;
  latestNotification: INotificationItem | null;
  refreshUnreadNotifications: () => Promise<void>;
}

export const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined
);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated, logout } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [latestCreatedOrder, setLatestCreatedOrder] = useState<IOrder | null>(null);
  const [latestUpdatedOrder, setLatestUpdatedOrder] = useState<IOrder | null>(null);
  const [latestNotification, setLatestNotification] =
    useState<INotificationItem | null>(null);

  const refreshUnreadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadNotifications(0);
      return;
    }

    try {
      const notifications = await getMyNotifications();
      setUnreadNotifications(notifications.filter((item) => !item.isRead).length);
    } catch (error) {
      console.error("Failed to refresh notification badge:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshUnreadNotifications();
  }, [refreshUnreadNotifications]);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
      return;
    }

    const activeSocket = connectSocket(token);

    const handleConnect = () => {
      setConnected(true);
      void refreshUnreadNotifications();
    };
    const handleDisconnect = () => setConnected(false);
    const handleConnectError = (error: Error & { data?: { code?: string } }) => {
      setConnected(false);
      if (
        error.data?.code === "TOKEN_EXPIRED" ||
        error.data?.code === "AUTH_INVALID" ||
        error.data?.code === "AUTH_REQUIRED"
      ) {
        disconnectSocket();
        logout();
      }
    };
    const handleOrderCreated = (order: IOrder) => setLatestCreatedOrder(order);
    const handleOrderUpdated = (order: IOrder) => setLatestUpdatedOrder(order);
    const handleNotification = (notification: INotificationItem) => {
      setLatestNotification(notification);
      if (!notification.isRead) {
        setUnreadNotifications((count) => count + 1);
      }
    };

    activeSocket.on("connect", handleConnect);
    activeSocket.on("disconnect", handleDisconnect);
    activeSocket.on("connect_error", handleConnectError);
    activeSocket.on("order:created", handleOrderCreated);
    activeSocket.on("order:status-updated", handleOrderUpdated);
    activeSocket.on("notification:new", handleNotification);
    setSocket(activeSocket);

    return () => {
      activeSocket.off("connect", handleConnect);
      activeSocket.off("disconnect", handleDisconnect);
      activeSocket.off("connect_error", handleConnectError);
      activeSocket.off("order:created", handleOrderCreated);
      activeSocket.off("order:status-updated", handleOrderUpdated);
      activeSocket.off("notification:new", handleNotification);
      disconnectSocket();
      setSocket(null);
      setConnected(false);
    };
  }, [isAuthenticated, logout, refreshUnreadNotifications, token]);

  const value = useMemo(
    () => ({
      socket,
      connected,
      unreadNotifications,
      latestCreatedOrder,
      latestUpdatedOrder,
      latestNotification,
      refreshUnreadNotifications,
    }),
    [
      connected,
      latestCreatedOrder,
      latestNotification,
      latestUpdatedOrder,
      refreshUnreadNotifications,
      socket,
      unreadNotifications,
    ]
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}
