"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const env_1 = require("../config/env");
const apiError_1 = require("../utils/apiError");
// Verify JWT token
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // Check authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new apiError_1.ApiError(401, "Not authorized. No token provided.");
        }
        const token = authHeader.split(" ")[1];
        // Verify JWT
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
// Verify admin access
const adminOnly = async (req, res, next) => {
    try {
        // Find logged-in user
        const user = await user_1.default.findById(req.user?.id);
        if (!user) {
            throw new apiError_1.ApiError(404, "User not found");
        }
        // Check admin role
        if (user.role !== "admin") {
            throw new apiError_1.ApiError(403, "Access denied. Admin only.");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.adminOnly = adminOnly;
