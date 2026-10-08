import { body, validationResult } from "express-validator";

export const validateUser = [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("dateOfBirth").optional().isDate().withMessage("Date of birth must be a date"),
    body("phoneNumber").optional().isNumeric().withMessage("Phone Number must be a number"),
    body("gender").optional()
        .isString()
        .withMessage("Gender must be a string")
        .isIn(["male", "female", "others"])
        .withMessage("Gender must be male, female, or others"),
    body("address").optional().isObject().withMessage("Address must be an object"),
    body("address.line").optional().isString().withMessage("Address line must be a string"),
    body("address.street").optional().isString().withMessage("Street must be a string"),
    body("address.city").optional().isString().withMessage("City must be a string"),
    body("address.state").optional().isString().withMessage("State must be a string"),
    body("address.zipCode").optional().isNumeric().withMessage("Zip Code must be a number"),
    body("address.country").optional().isString().withMessage("Country must be a string"),

    (req, res, next) => {
        const errors = validationResult(req)
        console.log("validation", errors);
        

        if (errors.isEmpty()) {
            return next()
        }

        res.status(400).json({
            status: "Error",
            message: errors.array()[0].msg,
        })
    }
]