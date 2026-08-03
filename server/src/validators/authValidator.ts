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
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required"),

  body("role")
    .optional()
    .isIn(["customer", "restaurant_owner"])
    .withMessage("Invalid registration type"),
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

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token")
    .isString()
    .matches(/^[a-f0-9]{64}$/)
    .withMessage("Invalid password reset token"),
  body("newPassword")
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),
];
