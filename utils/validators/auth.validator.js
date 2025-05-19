import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validator.middleware.js";

export const registerValidator = [
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any", { ignoreMobilePhoneNo: false })
    .withMessage("Invalid phone number"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("displayName")
    .notEmpty()
    .withMessage("Display name is required")
    .isLength({ max: 50 })
    .withMessage("Display name cannot exceed 50 characters"),
  check("experienceYears")
    .optional()
    .isNumeric()
    .withMessage("Experience years must be a number")
    .isInt({ min: 0 })
    .withMessage("Experience years cannot be negative"),
  check("address")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),
    check("level")
    .notEmpty()
    .withMessage("Level is required")
    .isIn(["fresh", "junior", "midLevel", "senior"])
    .withMessage("Level must be one of: fresh, junior, midLevel, senior"),
    validatorMiddleware
];





export const loginValidator = [
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any", { ignoreMobilePhoneNo: false })
    .withMessage("Invalid phone number"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];
