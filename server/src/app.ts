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
const app = express();

import {
  swaggerUi,
  swaggerSpec,
} from "./config/swagger";

// Middleware
app.use(cors());
app.use(express.json());
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

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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