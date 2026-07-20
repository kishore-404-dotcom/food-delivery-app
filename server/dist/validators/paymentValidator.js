"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentQueryValidator = exports.paymentIdValidator = exports.paymentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.paymentValidator = [
    (0, express_validator_1.body)("orderId")
        .trim()
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid Order ID"),
];
exports.paymentIdValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId()
        .withMessage("Invalid Payment ID"),
];
exports.paymentQueryValidator = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    (0, express_validator_1.query)("sort")
        .optional()
        .isIn([
        "amount",
        "-amount",
        "createdAt",
        "-createdAt",
        "paymentId",
        "-paymentId",
    ])
        .withMessage("Invalid sort field"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn([
        "PENDING",
        "SUCCESS",
        "FAILED",
    ])
        .withMessage("Invalid payment status"),
    (0, express_validator_1.query)("paymentMethod")
        .optional()
        .isIn([
        "DUMMY",
        "RAZORPAY",
    ])
        .withMessage("Invalid payment method"),
    (0, express_validator_1.query)("search")
        .optional()
        .isString()
        .withMessage("Search must be a string"),
];
