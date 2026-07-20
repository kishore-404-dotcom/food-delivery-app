import {
  body,
  param,
  query,
} from "express-validator";

export const addressValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required"),

  body("country")
    .optional()
    .trim(),

  body("addressType")
    .optional()
    .isIn([
      "HOME",
      "WORK",
      "OTHER",
    ])
    .withMessage("Invalid address type"),
];

export const addressIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid address ID"),
];

export const addressQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 }),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }),

  query("sort")
    .optional(),

  query("search")
    .optional(),
];