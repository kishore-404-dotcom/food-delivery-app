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

export const paymentVerificationValidator = [
  body("razorpayOrderId")
    .isString()
    .matches(/^order_[A-Za-z0-9]+$/)
    .withMessage("Invalid Razorpay order ID"),
  body("razorpayPaymentId")
    .isString()
    .matches(/^pay_[A-Za-z0-9]+$/)
    .withMessage("Invalid Razorpay payment ID"),
  body("razorpaySignature")
    .isString()
    .matches(/^[a-f0-9]{64}$/i)
    .withMessage("Invalid Razorpay signature"),
];

export const paymentFailureValidator = [
  body("razorpayOrderId")
    .isString()
    .matches(/^order_[A-Za-z0-9]+$/)
    .withMessage("Invalid Razorpay order ID"),
  body("reason")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Failure reason is required"),
  body("abandoned")
    .optional()
    .isBoolean()
    .withMessage("Abandoned must be a boolean"),
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
      "ABANDONED",
    ])
    .withMessage("Invalid payment status"),

  query("paymentMethod")
    .optional()
    .isIn([
      "RAZORPAY",
    ])
    .withMessage("Invalid payment method"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string"),
];
