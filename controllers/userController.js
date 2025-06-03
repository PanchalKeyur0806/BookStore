import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Order from "../models/orderModel.js";

const allUser = catchAsync(async (req, res, next) => {
  const allUser = await User.find();

  res.status(200).json({
    status: "success",
    allUser,
  });
});

// get information of specific user
const getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return next(new AppError("user id is not exists", 400));
  }

  // get the user from db
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("user does not exists", 404));
  }

  // return the response
  res.status(200).json({
    status: "success",
    message: "user found successfully",
    data: user,
  });
});

// get the information of loged in  User
const me = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(
      new AppError("your are not logged in please login to get access", 400)
    );
  }

  // fetch the user from db
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("user does not exists", 404));
  }

  // return the response
  res.status(200).json({
    status: "success",
    message: "user found successfully",
    data: user,
  });
});

// get the information of previous order history
const getUserOrders = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const findAllUserOrders = await Order.find({ user: id });
  if (!findAllUserOrders) {
    return next(new AppError("orders not found", 404));
  }

  res.status(200).json({
    status: "success",
    length: findAllUserOrders.length,
    data: findAllUserOrders,
  });
});

// update the user information
const updateUserInfo = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const updateUser = await User.findByIdAndUpdate(id, req.body);
  if (!updateUser) {
    return next(new AppError("user is not updated", 400));
  }

  res.status(201).json({
    status: "success",
    message: "user updated successfully",
  });
});

export { allUser, getUser, me, getUserOrders, updateUserInfo };
