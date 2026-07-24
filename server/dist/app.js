"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const restaurantRoutes_1 = __importDefault(require("./routes/restaurantRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const foodRoutes_1 = __importDefault(require("./routes/foodRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const requestLogger_1 = __importDefault(require("./middleware/requestLogger"));
const cors_2 = require("./config/cors");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
const swagger_1 = require("./config/swagger");
// Middleware
app.use((0, cors_1.default)({
    origin: cors_2.frontendOriginCallback,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(requestLogger_1.default);
app.use(rateLimiter_1.apiLimiter);
// Test Route
app.get("/", (req, res) => {
    res.status(200).send("🚀 Food Delivery API is running...");
});
// Auth Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// Restaurant Routes
app.use("/api/restaurants", restaurantRoutes_1.default);
// Food Routes
app.use("/api/foods", foodRoutes_1.default);
// Cart Routes
app.use("/api/cart", cartRoutes_1.default);
// Order Routes
app.use("/api/orders", orderRoutes_1.default);
// Payment Routes
app.use("/api/payments", paymentRoutes_1.default);
// Review Routes
app.use("/api/reviews", reviewRoutes_1.default);
// Address Routes
app.use("/api/addresses", addressRoutes_1.default);
// Coupon Routes
app.use("/api/coupons", couponRoutes_1.default);
// Notification Routes
app.use("/api/notifications", notificationRoutes_1.default);
// Wishlist Routes
app.use("/api/wishlist", wishlistRoutes_1.default);
// Swagger Documentation
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});
// Error middleware must always be last
app.use(errorMiddleware_1.default);
exports.default = app;
