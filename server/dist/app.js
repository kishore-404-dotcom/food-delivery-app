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
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Food Delivery API is running...");
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
// Error Middleware
app.use(errorMiddleware_1.default);
// Payment Routes
app.use("/api/payments", paymentRoutes_1.default);
exports.default = app;
