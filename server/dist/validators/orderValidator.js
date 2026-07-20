"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusValidator = exports.orderValidator = void 0;
const express_validator_1 = require("express-validator");
exports.orderValidator = [
    (0, express_validator_1.body)("paymentMethod")
        .isIn(["COD", "ONLINE"])
        .withMessage("Invalid payment method"),
    (0, express_validator_1.body)("deliveryAddress")
        .isMongoId()
        .withMessage("Valid delivery address is required"),
];
exports.orderStatusValidator = [
    (0, express_validator_1.body)("orderStatus")
        .isIn([
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
    ])
        .withMessage("Invalid order status"),
];
