"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
// Connect to MongoDB
const connectDB = async () => {
    try {
        // Check MongoDB URI
        if (!env_1.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }
        console.log("Connecting to MongoDB...");
        // Connect to MongoDB
        await mongoose_1.default.connect(env_1.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};
exports.default = connectDB;
