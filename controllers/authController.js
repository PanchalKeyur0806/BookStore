import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const register = catchAsync(async (req, res, next) => {
  const { name, email, password, dateOfBirth, phoneNumber, gender, address } =
    req.body;

  // saving user to database
  const createUser = await User.create({
    name,
    email,
    password,
    dateOfBirth,
    phoneNumber,
    gender,
    address,
  });

  // generate the token
  const token = signToken(createUser._id);

  // send response to the user
  res.status(200).json({
    message: "success",
    token,
    data: createUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });
  if (!findUser) {
    return next(new AppError("No user found ", 404));
  }

  const token = signToken(findUser._id);

  res.status(200).json({
    status: "success",
    token,
    data: findUser,
  });
});

export { register, login };
