import { body, validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

export const validateRegister = [
  body("name")
    .isString()
    .withMessage("please enter correct name")
    .notEmpty()
    .withMessage("please enter your name"),

  body("email")
    .isEmail()
    .withMessage("please provide valid email address")
    .notEmpty()
    .withMessage("email field should not be empty"),

  body("password").notEmpty().withMessage("please enter correct password"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "Error",
        message: errors.array()[0].msg,
      });

      next();
    }
  },
];
