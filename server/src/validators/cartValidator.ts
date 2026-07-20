import { body } from "express-validator";

// Add / Update cart validation
export const cartValidator = [

  body("foodId")
    .notEmpty()
    .withMessage("Food ID is required"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

];

// Remove item validation
export const removeCartItemValidator = [

  body("foodId")
    .notEmpty()
    .withMessage("Food ID is required"),

];