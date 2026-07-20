import { body, param, query } from "express-validator";

// Create / Update Review
export const reviewValidator = [
  body("food")
    .notEmpty()
    .withMessage("Food ID is required")
    .isMongoId()
    .withMessage("Invalid Food ID"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ min: 3, max: 500 })
    .withMessage(
      "Comment must be between 3 and 500 characters"
    ),

  body("order")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid Order ID"),
];

// Review ID Validator
export const reviewIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Review ID"),
];

// Food ID Validator
export const foodIdValidator = [
  param("foodId")
    .isMongoId()
    .withMessage("Invalid Food ID"),
];

// Query Validator
export const reviewQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(
      "Limit must be between 1 and 100"
    ),

  query("sort")
    .optional()
    .isIn([
      "rating",
      "-rating",
      "createdAt",
      "-createdAt",
    ])
    .withMessage("Invalid sort field"),
];