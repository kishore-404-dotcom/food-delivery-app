import { Server as HttpServer } from "http";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

import { JWT_SECRET } from "./config/env";
import { isAllowedFrontendOrigin } from "./config/cors";
import User from "./models/user";
import { JwtPayload } from "./types/jwtPayload";

interface AuthenticatedSocketData {
  userId: string;
  role: "customer" | "admin";
}

let io: Server | null = null;

const readHandshakeToken = (socket: Socket): string | undefined => {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken.trim();
  }

  const authorization = socket.handshake.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return undefined;
};

export const authenticateSocketToken = async (
  token?: string
): Promise<AuthenticatedSocketData> => {
  if (!token) {
    const error = new Error("Authentication required");
    Object.assign(error, { data: { code: "AUTH_REQUIRED" } });
    throw error;
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (cause) {
    const code = cause instanceof TokenExpiredError ? "TOKEN_EXPIRED" : "AUTH_INVALID";
    const error = new Error(
      code === "TOKEN_EXPIRED" ? "Authentication token expired" : "Invalid authentication token"
    );
    Object.assign(error, { data: { code } });
    throw error;
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    const error = new Error("Authenticated user no longer exists");
    Object.assign(error, { data: { code: "AUTH_INVALID" } });
    throw error;
  }

  return {
    userId: user._id.toString(),
    role: user.role,
  };
};

export const getSocketRooms = (auth: AuthenticatedSocketData): string[] => {
  const rooms = [`user:${auth.userId}`];
  if (auth.role === "admin") rooms.push("admin");
  return rooms;
};

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedFrontendOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Socket.IO CORS policy violation"));
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      socket.data.auth = await authenticateSocketToken(readHandshakeToken(socket));
      next();
    } catch (error) {
      next(error as Error);
    }
  });

  io.on("connection", (socket) => {
    const auth = socket.data.auth as AuthenticatedSocketData;
    void socket.join(getSocketRooms(auth));
  });

  return io;
};

export const emitToUser = (userId: string, event: string, payload: unknown): void => {
  io?.to(`user:${userId}`).emit(event, payload);
};

export const emitToAdmins = (event: string, payload: unknown): void => {
  io?.to("admin").emit(event, payload);
};
