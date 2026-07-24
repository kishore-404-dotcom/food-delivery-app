import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import adminRoutes from "./routes/adminRoutes";

import foodRoutes from "./routes/foodRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import errorMiddleware from "./middleware/errorMiddleware";

import paymentRoutes from "./routes/paymentRoutes";

import reviewRoutes from "./routes/reviewRoutes";

import addressRoutes from "./routes/addressRoutes";

import couponRoutes from "./routes/couponRoutes";

import notificationRoutes from "./routes/notificationRoutes";

import wishlistRoutes from "./routes/wishlistRoutes";

import { apiLimiter } from "./middleware/rateLimiter";

import requestLogger from "./middleware/requestLogger";
import { frontendOriginCallback } from "./config/cors";
import { NODE_ENV } from "./config/env";
const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

import {
  swaggerUi,
  swaggerSpec,
} from "./config/swagger";

// Middleware
app.use(
  cors({
    origin: frontendOriginCallback,
    credentials: true,
  })
);
app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});
app.use(requestLogger);
app.use(apiLimiter);

// Test Route
app.get("/", (req, res) => {
  res.status(200).send("🚀 Food Delivery API is running...");
});

// Auth Routes
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

// Restaurant Routes
app.use("/api/restaurants", restaurantRoutes);

// Food Routes
app.use("/api/foods", foodRoutes);

// Cart Routes
app.use("/api/cart", cartRoutes); 

// Order Routes
app.use("/api/orders", orderRoutes);

// Payment Routes
app.use("/api/payments", paymentRoutes);

// Review Routes
app.use("/api/reviews", reviewRoutes);

// Address Routes
app.use("/api/addresses", addressRoutes);

// Coupon Routes
app.use("/api/coupons", couponRoutes);

// Notification Routes
app.use("/api/notifications", notificationRoutes);

// Wishlist Routes
app.use("/api/wishlist", wishlistRoutes);

// Swagger is a development aid; do not expose the empty scaffold in production.
if (NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error middleware must always be last
app.use(errorMiddleware);

export default app;
