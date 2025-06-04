import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Order from "../models/orderModel.js";
import Books from "../models/booksModel.js";

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

// user favourite books
const userFavBooks = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const { bookId } = req.body;
  if (!bookId) {
    return next(new AppError("please provide book id", 404));
  }

  // find the user
  const findExistingFav = await User.findById(id);

  // check that fav book is exists
  if (findExistingFav) {
    // return error if there is already book in the faviourites
    if (findExistingFav.faviourites.includes(bookId)) {
      return next(new AppError("Book is already in favourites", 400));
    }

    // push book to faviourites
    findExistingFav.faviourites.push(bookId);
    await findExistingFav.save();

    // return the response
    res.status(200).json({
      status: "success",
      message: "Book added to favourites",
      data: findExistingFav,
    });
  }
  // if faviourites not exists
  else {
    // push book to faviourites
    const updateUserFav = await User.findByIdAndUpdate(id, {
      $push: { faviourites: bookId },
    });

    // return the response
    res.status(200).json({
      status: "success",
      message: "book added to favourites",
      data: updateUserFav,
    });
  }
});

export { allUser, getUser, me, getUserOrders, updateUserInfo, userFavBooks };
