"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const apiResponse_1 = require("../utils/apiResponse");
const authService_1 = require("../services/authService");
const user_1 = __importDefault(require("../models/user"));
// Register
exports.register = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authService_1.registerUser)(req.body);
    res.status(201).json(new apiResponse_1.ApiResponse(true, "User registered successfully", user));
});
// Login
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const result = await (0, authService_1.loginUser)(email, password);
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Login successful", result));
});
// Get logged-in user profile
exports.getProfile = (0, asyncHandler_1.default)(async (req, res) => {
    // Find logged-in user
    const user = await user_1.default.findById(req.user?.id).select("-password");
    res.status(200).json(new apiResponse_1.ApiResponse(true, "Profile fetched successfully", user));
});
