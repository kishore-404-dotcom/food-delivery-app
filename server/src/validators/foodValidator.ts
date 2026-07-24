import { body, param, query } from "express-validator";

export const foodValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Food name is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("price")
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage("Price must be a number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("restaurant")
    .isMongoId()
    .withMessage("A valid restaurant is required"),

];

export const foodUpdateValidator = [
  param("id").isMongoId().withMessage("Invalid food ID"),
  body("name").optional().trim().isLength({ min: 1, max: 120 }),
  body("description").optional().trim().isLength({ min: 1, max: 1000 }),
  body("price").optional().isFloat({ min: 0.01, max: 100000 }),
  body("category").optional().trim().isLength({ min: 1, max: 80 }),
  body("restaurant").optional().isMongoId(),
  body("isAvailable").optional().isBoolean(),
];

export const foodIdValidator = [
  param("id").isMongoId().withMessage("Invalid food ID"),
];

export const foodSearchValidator = [
  query("name").optional().trim().isLength({ max: 100 }),
];
