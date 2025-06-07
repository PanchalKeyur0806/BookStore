import mongoose, { startSession } from "mongoose";
import Books from "../models/booksModel.js";
import Review from "../models/reviewModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

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

  const reviews = await Review.find();

  if (reviews.length === 0) {
    return next(new AppError("Reviews not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: reviews,
  });
});

export { createReview, getAllBooksReviews };
