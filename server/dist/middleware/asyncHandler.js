"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Wrap async route handlers with preserved request generics
const asyncHandler = (fn) => {
    return ((...args) => {
        const next = args[args.length - 1];
        Promise.resolve(fn(...args)).catch(next);
    });
};
exports.default = asyncHandler;
