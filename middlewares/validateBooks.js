import { body, validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

export const validateRegister = [
  body("title")
    .isString()
    .withMessage("please enter correct book name")
    .notEmpty()
    .withMessage("please enter book name"),

  body("author")
    .isString()
    .withMessage("please provide correct book's author")
    .notEmpty()
    .withMessage("author field should not be empty"),

  body("stock")
    .isNumeric()
    .withMessage("please enter correct stock")
    .notEmpty()
    .withMessage("please enter stock field"),

  body("description")
    .isString()
    .withMessage("please provide correct description")
    .notEmpty()
    .withMessage("please enter your description field"),

  body("price")
    .isLength({ min: 10 })
    .withMessage("phoneNumber min length must be 1 characters")
    .isNumeric()
    .withMessage("please enter correct price")
    .notEmpty()
    .withMessage("please enter your price field"),

  body("category")
    .isIn([
      "Fantasy",
      "Action",
      "Adventure",
      "Mystery",
      "Horror",
      "Thriller",
      "Romance",
      "Self-help",
      "Biography",
    ])
    .withMessage("please provide category according to list")
    .notEmpty()
    .withMessage("address field should not be empty"),

  body("coverImage")
    .isString()
    .withMessage("please enter correct coverImage")
    .notEmpty()
    .withMessage("coverImage should not be empty"),

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
