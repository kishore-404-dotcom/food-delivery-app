import { body } from "express-validator";

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
    .isNumeric()
    .withMessage("Delivery time must be a number"),

];