"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewQueryValidator = exports.foodIdValidator = exports.reviewIdValidator = exports.reviewValidator = void 0;
const express_validator_1 = require("express-validator");
// Create / Update Review
exports.reviewValidator = [
    (0, express_validator_1.body)("food")
        .notEmpty()
        .withMessage("Food ID is required")
        .isMongoId()
        .withMessage("Invalid Food ID"),
    (0, express_validator_1.body)("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    (0, express_validator_1.body)("comment")
        .trim()
        .notEmpty()
        .withMessage("Comment is required")
        .isLength({ min: 3, max: 500 })
        .withMessage("Comment must be between 3 and 500 characters"),
    (0, express_validator_1.body)("order")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid Order ID"),
];
// Review ID Validator
exports.reviewIdValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId()
        .withMessage("Invalid Review ID"),
];
// Food ID Validator
exports.foodIdValidator = [
    (0, express_validator_1.param)("foodId")
        .isMongoId()
        .withMessage("Invalid Food ID"),
];
// Query Validator
exports.reviewQueryValidator = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    (0, express_validator_1.query)("sort")
        .optional()
        .isIn([
        "rating",
        "-rating",
        "createdAt",
        "-createdAt",
    ])
        .withMessage("Invalid sort field"),
];
