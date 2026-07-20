"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.paymentValidator = [
    (0, express_validator_1.body)("orderId")
        .trim()
        .notEmpty()
        .withMessage("Order ID is required"),
];
