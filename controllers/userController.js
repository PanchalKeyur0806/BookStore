import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const allUser = catchAsync(async (req, res, next) => {
  const allUser = await User.find();

  res.status(200).json({
    status: "success",
    allUser,
  });
});

export { allUser };
