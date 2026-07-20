"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItemValidator = exports.cartValidator = void 0;
const express_validator_1 = require("express-validator");
// Add / Update cart validation
exports.cartValidator = [
    (0, express_validator_1.body)("foodId")
        .notEmpty()
        .withMessage("Food ID is required"),
    (0, express_validator_1.body)("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
];
// Remove item validation
exports.removeCartItemValidator = [
    (0, express_validator_1.body)("foodId")
        .notEmpty()
        .withMessage("Food ID is required"),
];
