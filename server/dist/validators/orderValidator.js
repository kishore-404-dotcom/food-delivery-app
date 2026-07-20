"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusValidator = exports.orderValidator = void 0;
const express_validator_1 = require("express-validator");
// Place order validation
exports.orderValidator = [
    (0, express_validator_1.body)("paymentMethod")
        .isIn(["COD", "ONLINE"])
        .withMessage("Invalid payment method"),
];
// Update status validation
exports.orderStatusValidator = [
    (0, express_validator_1.body)("orderStatus")
        .isIn([
        "PLACED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
    ])
        .withMessage("Invalid order status"),
];
