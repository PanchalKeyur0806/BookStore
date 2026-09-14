import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

// function for validating id from params
export const validateId = (paramId) => {
  return (req, res, next) => {
    // get the id from params
    const id = req.params[paramId];

    // check that id is valid, if not return the error message
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return next(
        new AppError("Invalid Id, please enter correct email id", 400),
      );
    }

    // else proceed,
    next();
  };
};
