import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const profileUpdateValidator = [
  body("name").optional().trim().isLength({ min: 2, max: 80 }),
  body("phone").optional().trim().matches(/^[0-9]{10,15}$/),
  body().custom((value) => {
    if (!value.name && !value.phone) {
      throw new Error("Name or phone is required");
    }
    return true;
  }),
];

export const changePasswordValidator = [
  body("currentPassword").isString().notEmpty(),
  body("newPassword").isString().isLength({ min: 8, max: 128 }),
];
