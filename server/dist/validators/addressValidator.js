"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressQueryValidator = exports.addressIdValidator = exports.addressValidator = void 0;
const express_validator_1 = require("express-validator");
exports.addressValidator = [
    (0, express_validator_1.body)("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),
    (0, express_validator_1.body)("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("en-IN")
        .withMessage("Invalid phone number"),
    (0, express_validator_1.body)("addressLine1")
        .trim()
        .notEmpty()
        .withMessage("Address Line 1 is required"),
    (0, express_validator_1.body)("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),
    (0, express_validator_1.body)("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),
    (0, express_validator_1.body)("postalCode")
        .trim()
        .notEmpty()
        .withMessage("Postal code is required"),
    (0, express_validator_1.body)("country")
        .optional()
        .trim(),
    (0, express_validator_1.body)("addressType")
        .optional()
        .isIn([
        "HOME",
        "WORK",
        "OTHER",
    ])
        .withMessage("Invalid address type"),
];
exports.addressIdValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId()
        .withMessage("Invalid address ID"),
];
exports.addressQueryValidator = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 }),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)("sort")
        .optional(),
    (0, express_validator_1.query)("search")
        .optional(),
];
