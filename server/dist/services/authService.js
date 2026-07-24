"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = exports.updateUserProfileService = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const apiError_1 = require("../utils/apiError");
const env_1 = require("../config/env");
// Register user
const registerUser = async (userData) => {
    const { name, email, password, phone } = userData;
    // Check if email already exists
    const existingUser = await user_1.default.findOne({ email });
    if (existingUser) {
        throw new apiError_1.ApiError(400, "Email already registered");
    }
    // Hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // Create user
    const user = await user_1.default.create({
        name,
        email,
        password: hashedPassword,
        phone,
    });
    // Remove password before returning
    const { password: _, ...userResponse } = user.toObject();
    return userResponse;
};
exports.registerUser = registerUser;
// Login user
const loginUser = async (email, password) => {
    // Find user
    const user = await user_1.default.findOne({ email });
    if (!user) {
        throw new apiError_1.ApiError(400, "Invalid email or password");
    }
    // Compare password
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new apiError_1.ApiError(400, "Invalid email or password");
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, env_1.JWT_SECRET, {
        expiresIn: "7d",
    });
    // Remove password before returning
    const { password: _, ...userResponse } = user.toObject();
    return {
        token,
        user: userResponse,
    };
};
exports.loginUser = loginUser;
// Update Profile (Allowed fields: name, phone)
const updateUserProfileService = async (userId, data) => {
    const user = await user_1.default.findById(userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    if (data.name)
        user.name = data.name.trim();
    if (data.phone)
        user.phone = data.phone.trim();
    await user.save();
    const { password: _, ...userResponse } = user.toObject();
    return userResponse;
};
exports.updateUserProfileService = updateUserProfileService;
// Change Password
const changePasswordService = async (userId, currentPassword, newPassword) => {
    const user = await user_1.default.findById(userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new apiError_1.ApiError(400, "Incorrect current password");
    }
    if (newPassword.length < 6) {
        throw new apiError_1.ApiError(400, "New password must be at least 6 characters long");
    }
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    await user.save();
    return { message: "Password updated successfully" };
};
exports.changePasswordService = changePasswordService;
