// import model
import Wishlist from "../models/wishlistModel.js";
import Books from "../models/booksModel.js";

// import utils
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.find({
    user: req.user._id,
  }).populate({
    path: "book",
    select: "title author price coverImage category ratingAverage stock",
  });

  return res.json({
    status: "success",
    message: "All wishlist items are successfully found",
    results: wishlist.length,
    data: wishlist,
  });
});

// controller function for adding books to wishlist
export const addToWishlist = catchAsync(async (req, res, next) => {
  // get the book id from the params
  const { bookId } = req.params;

  // Check if book exists
  const book = await Books.findById(bookId);
  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  // Check if book is already in user's wishlist
  const existingWishlist = await Wishlist.findOne({
    user: req.user._id,
    book: bookId,
  });
  if (existingWishlist) {
    return next(new AppError("Book is already in your wishlist", 400));
  }

  // Add book to wishlist
  const wishlist = await Wishlist.create({
    user: req.user._id,
    book: bookId,
  });

  // return the response
  return res.status(201).json({
    status: "success",
    message: "Book successfully added to wishlist",
    data: wishlist,
  });
});

// controller function for removing books from wishlist
export const removeFromWishlist = catchAsync(async (req, res, next) => {
  // get the book id from params
  const { bookId } = req.params;

  // find the book in wishlist
  const wishlist = await Wishlist.findOneAndDelete({
    user: req.user._id,
    book: bookId,
  });

  // if book not found then return the error message
  if (!wishlist) {
    return next(new AppError("Book is not in your wishlist", 404));
  }

  // return the successfull response
  return res.status(200).json({
    status: "success",
    message: "Book successfully removed from wishlist",
  });
});
