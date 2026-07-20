import { body } from "express-validator";

export const orderValidator = [

  body("paymentMethod")
    .isIn(["COD", "ONLINE"])
    .withMessage("Invalid payment method"),

  body("deliveryAddress")
    .isMongoId()
    .withMessage("Valid delivery address is required"),

];

export const orderStatusValidator = [

  body("orderStatus")
    .isIn([
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ])
    .withMessage("Invalid order status"),

];