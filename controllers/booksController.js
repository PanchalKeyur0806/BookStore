import Books from "../models/booksModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// create books
const createBooks = catchAsync(async (req, res, next) => {
  const { title, author, stock, description, price, category, coverImage } =
    req.body;

  // create the books
  const createBook = await Books.create({
    title,
    author,
    stock,
    description,
    price,
    category,
    coverImage,
  });
  if (!createBook || (createBook === undefined && createBook === null)) {
    return next(
      new AppError("books is not created yet, please try again later", 400)
    );
  }

  //   return the response
  res.status(201).json({
    status: "success",
    message: "Book is created",
    data: createBook,
  });
});

// getAll the books
const getAllBooks = catchAsync(async (req, res, next) => {
  // find all books
  const allBooks = await Books.find();
  if (!allBooks || allBooks.length < 0) {
    return next(new AppError("Books not found", 404));
  }

  //   return the response
  res.status(200).json({
    status: "success",
    message: "all books found",
    length: allBooks.length,
    data: allBooks,
  });
});

// get specific books
const getOneBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId || typeof bookId !== "string") {
    return next(
      new AppError("Book id not found, please provide bookId in params", 400)
    );
  }

  //   find the book
  const findBook = await Books.findById(bookId);
  if (!findBook) {
    return next(new AppError("Book not found", 404));
  }

  //   return the response
  res.status(200).json({
    status: "success",
    message: "Book is found",
    data: findBook,
  });
});

// patch the books
const updateBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId || typeof bookId !== "string") {
    return next(
      new AppError("Book id not found, please provide bookId in params", 400)
    );
  }

  const updateBook = await Books.findByIdAndUpdate(bookId, req.body);
  if (!updateBook) {
    return next(new AppError("Book not found", 400));
  }

  res.status(200).json({
    status: "success",
    message: "book is updated",
    data: updateBook,
  });
});

// delete the books
const deleteBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId || typeof bookId !== "string") {
    return next(
      new AppError("Book id not found, please provide bookId in params", 400)
    );
  }

  //   delete the book
  const removeBook = await Books.findByIdAndDelete(bookId);
  if (!removeBook) {
    return next(new AppError("Book not found", 404));
  }

  //   return the response
  res.status(204).json({
    status: "success",
    message: "Book is deleted",
  });
});

export { createBooks, getAllBooks, getOneBook, updateBook, deleteBook };
