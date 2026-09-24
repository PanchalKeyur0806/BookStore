import mongoose, { startSession } from "mongoose";
import Books from "../models/booksModel.js";
import Review from "../models/reviewModel.js";
import AppError from "../utils/AppError.js";
import AppFeatures from "../utils/AppFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import client from "../config/redisClient.js";

// get all the reviews
const getAllReviews = catchAsync(async (req, res, next) => {
  const { sort, msg } = req.query;

  const queryObj = {};

  if (msg) {
    queryObj.review = { $regex: msg, $options: "i" };
  }

  const sortOptions = {
    new: "-createdAt",
    old: "createdAt",
  };

  const sortKey = sortOptions[sort] || sortOptions.new;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (limit > 100) {
    limit = 100;
  }

  const reviews = await Review.find(queryObj)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalItems = await Review.countDocuments(queryObj);
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;

  res.status(200).json({
    status: "success",
    message: "reviews found successfully",
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      hasNextPage,
    },
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

  const reviewData = await client.get(`user:${id}:book:${bookId}`);
  if (!reviewData) {
    const review = await Review.findOne({ book: bookId, user: id });
    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    await client.set(`user:${id}:book:${bookId}`, JSON.stringify(review));

    return res.status(200).json({
      status: "success",
      data: review,
    });
  }

  res.status(200).json({
    status: "success",
    message: "review found successfully",
    data: JSON.parse(reviewData),
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
  const { sort, msg } = req.query;

  if (!bookId) {
    return next(new AppError("Please provide bookId", 400));
  }

  const queryObj = {
    book: new mongoose.Types.ObjectId(bookId),
  };

  if (msg) {
    queryObj.review = { $regex: msg, $options: "i" };
  }

  const sortOptions = {
    new: "-createdAt",
    old: "createdAt",
  };

  const sortKey = sortOptions[sort] || sortOptions.new;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (limit > 100) {
    limit = 100;
  }

  const reviews = await Review.find(queryObj)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalItems = await Review.countDocuments(queryObj);
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;

  res.status(200).json({
    status: "success",
    length: reviews.length,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      hasNextPage,
    },
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
    req.body,
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
