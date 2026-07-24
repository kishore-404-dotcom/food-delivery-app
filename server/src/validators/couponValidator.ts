import { body, param } from "express-validator";

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
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage(
      "Discount value must be a number"
    ),

  body("minOrderAmount")
    .isFloat({ min: 0, max: 1000000 })
    .withMessage(
      "Minimum order amount must be a number"
    ),

  body("expiryDate")
    .isISO8601()
    .withMessage(
      "Expiry date is required"
    ),

  body().custom((value) => {
    if (value.discountType === "percentage" && Number(value.discountValue) > 100) {
      throw new Error("Percentage discount cannot exceed 100");
    }
    if (new Date(value.expiryDate) <= new Date()) {
      throw new Error("Expiry date must be in the future");
    }
    return true;
  }),

];

export const couponApplyValidator = [
  body("code")
    .trim()
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Za-z0-9_-]+$/),
  body("totalAmount").isFloat({ min: 0.01, max: 1000000 }),
];

export const couponIdValidator = [
  param("id").isMongoId().withMessage("Invalid coupon ID"),
];
