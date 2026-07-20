"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Wrap async route handlers
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
