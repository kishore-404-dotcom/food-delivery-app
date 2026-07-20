import { body, param, query } from "express-validator";

export const paymentValidator = [
  body("orderId")
    .trim()
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid Order ID"),
];

export const paymentIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Payment ID"),
];

export const paymentQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort")
    .optional()
    .isIn([
      "amount",
      "-amount",
      "createdAt",
      "-createdAt",
      "paymentId",
      "-paymentId",
    ])
    .withMessage("Invalid sort field"),

  query("status")
    .optional()
    .isIn([
      "PENDING",
      "SUCCESS",
      "FAILED",
    ])
    .withMessage("Invalid payment status"),

  query("paymentMethod")
    .optional()
    .isIn([
      "DUMMY",
      "RAZORPAY",
    ])
    .withMessage("Invalid payment method"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string"),
];