import mongoose, { startSession } from "mongoose";
import Books from "../models/booksModel.js";
import Review from "../models/reviewModel.js";
import AppError from "../utils/AppError.js";
import AppFeatures from "../utils/AppFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

// get all the reviews
const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new AppFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const reviews = await features.query;

  res.status(200).json({
    status: "success",
    message: "reviews found successfully",
    length: reviews.length,
    data: reviews,
  });
});

// get one specific review
const getOneReview = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const { id } = req.user;

  if (!bookId) {
    return next(new AppError("Book id not found", 404));
  }

  const review = await Review.findOne({ book: bookId, user: id });

  res.status(200).json({
    status: "success",
    message: "review found successfully",
    data: review,
  });
});

// create a review on books
const createReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;

  const { id } = req.user;
  const { bookId } = req.params;

  const findBook = await Books.findById(bookId);
  if (!findBook) {
    return next(new AppError("Book not exists", 404));
  }

  const createReview = await Review.create({
    user: id,
    review,
    rating,
    book: bookId,
  });

  res.status(200).json({
    status: "success",
    message: "Review created successfully",
    data: createReview,
  });
});

// get all books review
const getAllBooksReviews = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  if (!bookId) {
    return next(new AppError("Provide Book Id", 404));
  }

  const reviews = await Review.find({ book: bookId });

  if (reviews.length === 0) {
    return next(new AppError("Reviews not found", 404));
  }

  res.status(200).json({
    status: "success",
    length: reviews,
    data: reviews,
  });
});

// update one specific Books review
const updateReview = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const { id } = req.user;

  if (!bookId) {
    return next(new AppError("Book id not found", 404));
  }

  const review = await Review.findOneAndUpdate(
    { book: bookId, user: id },
    req.body
  );

  res.status(200).json({
    status: "success",
    message: "review updated successfully",
  });
});

// delete a review
const deleteReview = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const { id } = req.user;

  const review = await Review.findOneAndDelete({ book: bookId, user: id });

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
  });
});

export {
  createReview,
  getAllBooksReviews,
  getOneReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
