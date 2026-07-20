"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = require("../utils/apiError");
// Global error handler
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.default = errorMiddleware;
