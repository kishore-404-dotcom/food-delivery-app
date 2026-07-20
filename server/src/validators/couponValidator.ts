import { body } from "express-validator";

export const couponValidator = [

  body("code")
    .notEmpty()
    .withMessage("Coupon code is required"),

  body("discountType")
    .isIn(["flat", "percentage"])
    .withMessage(
      "Discount type must be either flat or percentage"
    ),

  body("discountValue")
    .isNumeric()
    .withMessage(
      "Discount value must be a number"
    ),

  body("minOrderAmount")
    .isNumeric()
    .withMessage(
      "Minimum order amount must be a number"
    ),

  body("expiryDate")
    .notEmpty()
    .withMessage(
      "Expiry date is required"
    ),

];