"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentQueryValidator = exports.paymentFailureValidator = exports.paymentVerificationValidator = exports.paymentIdValidator = exports.paymentValidator = void 0;
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
exports.paymentVerificationValidator = [
    (0, express_validator_1.body)("razorpayOrderId")
        .isString()
        .matches(/^order_[A-Za-z0-9]+$/)
        .withMessage("Invalid Razorpay order ID"),
    (0, express_validator_1.body)("razorpayPaymentId")
        .isString()
        .matches(/^pay_[A-Za-z0-9]+$/)
        .withMessage("Invalid Razorpay payment ID"),
    (0, express_validator_1.body)("razorpaySignature")
        .isString()
        .matches(/^[a-f0-9]{64}$/i)
        .withMessage("Invalid Razorpay signature"),
];
exports.paymentFailureValidator = [
    (0, express_validator_1.body)("razorpayOrderId")
        .isString()
        .matches(/^order_[A-Za-z0-9]+$/)
        .withMessage("Invalid Razorpay order ID"),
    (0, express_validator_1.body)("reason")
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage("Failure reason is required"),
    (0, express_validator_1.body)("abandoned")
        .optional()
        .isBoolean()
        .withMessage("Abandoned must be a boolean"),
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
        "ABANDONED",
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
