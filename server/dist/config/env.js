"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAZORPAY_KEY_SECRET = exports.RAZORPAY_KEY_ID = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.MONGODB_URI = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 5000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
exports.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
