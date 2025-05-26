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

  body("dateOfBirth")
    .isDate()
    .withMessage("please enter your date of birth")
    .notEmpty()
    .withMessage("please enter date of birth field"),

  body("phoneNumber")
    .isLength({ min: 10, max: 10 })
    .withMessage("phoneNumber lenght must be 10 characters")
    .isNumeric()
    .withMessage("phone number field must be a number")
    .notEmpty()
    .withMessage("please enter your phone number"),

  body("gender")
    .isIn(["male", "female", "others"])
    .withMessage("Invalid gender selection")
    .notEmpty()
    .withMessage("please enter your gender"),

  body("address").notEmpty().withMessage("address field should not be empty"),

  body("address.street")
    .isString()
    .withMessage("please enter correct street")
    .notEmpty()
    .withMessage("street should not be empty"),

  body("address.city")
    .isString()
    .withMessage("please enter correct city")
    .notEmpty()
    .withMessage("city should not be empty"),

  body("address.state")
    .isString()
    .withMessage("please enter correct state")
    .notEmpty()
    .withMessage("state should not be empty"),

  body("address.zipCode")
    .isNumeric()
    .withMessage("please enter correct zipCode")
    .notEmpty()
    .withMessage("zipCode should not be empty"),

  body("address.country")
    .isString()
    .withMessage("please enter correct country")
    .notEmpty()
    .withMessage("country should not be empty"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "Error",
        message: errors.array()[0].msg,
      });
    }

    next();
  },
];
