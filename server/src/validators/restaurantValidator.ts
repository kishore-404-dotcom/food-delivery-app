import { body, param, query } from "express-validator";

export const RestaurantValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("address")
    .notEmpty()
    .withMessage("Address is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("deliveryTime")
    .isInt({ min: 1, max: 240 })
    .withMessage("Delivery time must be a number"),

];

export const restaurantUpdateValidator = [
  param("id").isMongoId().withMessage("Invalid restaurant ID"),
  body("name").optional().trim().isLength({ min: 1, max: 120 }),
  body("description").optional().trim().isLength({ min: 1, max: 1000 }),
  body("address").optional().trim().isLength({ min: 1, max: 500 }),
  body("category").optional().trim().isLength({ min: 1, max: 80 }),
  body("deliveryTime").optional().isInt({ min: 1, max: 240 }),
  body("deliveryFee").optional().isFloat({ min: 0, max: 10000 }),
  body("isOpen").optional().isBoolean(),
];

export const restaurantIdValidator = [
  param("id").isMongoId().withMessage("Invalid restaurant ID"),
];

export const restaurantSearchValidator = [
  query("name").optional().trim().isLength({ max: 100 }),
];
