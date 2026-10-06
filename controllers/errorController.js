import AppError from "../utils/AppError.js";

const DuplicateKeyError = () => {
  const message = "Duplicate field value entered. Please use another value";
  return new AppError(message, 400);
};

const JWTExpiredError = () => {
  return new AppError("Your token has expired. Please log in again.", 401);
}

const JWTInvalidError = () => {
  return new AppError("Invalid token. Please log in again.", 401);
};


// send production error
const sendProductionError = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: "Error",
      message: error.message,
    });
  } else {
    console.log(error)
    res.status(200).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  let { message, statusCode } = err;

  // check that if server is in production
  if (process.env.NODE_ENV === "production") {
    let error = Object.assign(new Error(), err);
    error.message = err.message || "Something Went Wrong!";

    if (err.code === 11000) error = DuplicateKeyError();

    // JWT errors
    if (err.name === "TokenExpiredError") {
      error = JWTExpiredError();
    }

    if (err.name === "JsonWebTokenError") {
      error = JWTInvalidError();
    }

    sendProductionError(error, res);
  } else {
    res.status(400).json({
      status: "Error",
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    });
  }
};

export default errorHandler;
