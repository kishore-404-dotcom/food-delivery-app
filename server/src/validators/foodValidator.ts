import { body } from "express-validator";

export const foodValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Food name is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("restaurant")
    .notEmpty()
    .withMessage("Restaurant is required"),

];