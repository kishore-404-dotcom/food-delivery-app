"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const apiError_1 = require("../utils/apiError");
// Global error handler
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    if (err instanceof multer_1.default.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "Image exceeds the maximum file size of 5 MB."
            : `Image upload failed: ${err.message}`;
        return res.status(400).json({
            success: false,
            message,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.default = errorMiddleware;
