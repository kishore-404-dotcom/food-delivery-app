"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantValidator = void 0;
const express_validator_1 = require("express-validator");
exports.RestaurantValidator = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Restaurant name is required"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("Description is required"),
    (0, express_validator_1.body)("address")
        .notEmpty()
        .withMessage("Address is required"),
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("Category is required"),
    (0, express_validator_1.body)("deliveryTime")
        .isNumeric()
        .withMessage("Delivery time must be a number"),
];
