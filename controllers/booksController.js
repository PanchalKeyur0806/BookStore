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

export { createBooks };
