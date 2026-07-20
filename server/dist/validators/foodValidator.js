"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodValidator = void 0;
const express_validator_1 = require("express-validator");
exports.foodValidator = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Food name is required"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("Description is required"),
    (0, express_validator_1.body)("price")
        .isNumeric()
        .withMessage("Price must be a number"),
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("Category is required"),
    (0, express_validator_1.body)("restaurant")
        .notEmpty()
        .withMessage("Restaurant is required"),
];
