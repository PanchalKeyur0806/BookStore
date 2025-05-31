const errorHandler = (err, req, res, next) => {
  let { message, statusCode } = err;

  res.status(400).json({
    status: "Error",
    message: message || "Some error occured, please report to admin",
    statusCode: statusCode || 500,
    stackTrace: err.stack,
  });
};

export default errorHandler;
