import AppError from "../utils/AppError.js";

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you are not allowed to perform this action", 403)
      );
    }

    next();
  };
};

export default restrictTo;
