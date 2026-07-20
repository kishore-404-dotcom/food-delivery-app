"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponValidator = void 0;
const express_validator_1 = require("express-validator");
exports.couponValidator = [
    (0, express_validator_1.body)("code")
        .notEmpty()
        .withMessage("Coupon code is required"),
    (0, express_validator_1.body)("discountType")
        .isIn(["flat", "percentage"])
        .withMessage("Discount type must be either flat or percentage"),
    (0, express_validator_1.body)("discountValue")
        .isNumeric()
        .withMessage("Discount value must be a number"),
    (0, express_validator_1.body)("minOrderAmount")
        .isNumeric()
        .withMessage("Minimum order amount must be a number"),
    (0, express_validator_1.body)("expiryDate")
        .notEmpty()
        .withMessage("Expiry date is required"),
];
