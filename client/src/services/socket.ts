import { io, type Socket } from "socket.io-client";

import { API_BASE_URL } from "./api";

export const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, "");

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_BASE_URL, {
      autoConnect: false,
      auth: { token },
      reconnection: true,
      transports: ["websocket", "polling"],
    });
  } else {
    socket.auth = { token };
  }

  if (!socket.connected) socket.connect();
  return socket;
};

export const disconnectSocket = (): void => {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
};
