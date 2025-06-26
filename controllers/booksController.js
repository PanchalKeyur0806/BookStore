import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// configuration of cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import Books from "../models/booksModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import AppFeatures from "../utils/AppFeatures.js";
import client from "../config/redisClient.js";

// create books
const createBooks = catchAsync(async (req, res, next) => {
  const filePath = req.file.path;
  const { title, author, stock, description, price, category, coverImage } =
    req.body;

  // store images in cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "BookStore",
  });

  // delete local tem file
  await fs.unlink(filePath);

  // create the books
  const createBook = await Books.create({
    title,
    author,
    stock,
    description,
    price,
    category,
    coverImage: result.secure_url,
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
  const features = new AppFeatures(Books.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const allBooks = await features.query;

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

  // check that book is exist in redis
  // if yes then return the response
  // else search in mongodb and save it to Redis

  const bookKey = await client.get(`book:${bookId}`);

  if (!bookKey) {
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
    await client.set(`book:${bookId}`, JSON.stringify(findBook));

    return res.status(200).json({
      status: "success",
      message: "Book is found",
      data: findBook,
    });
  }

  //   return the response
  res.status(200).json({
    status: "success",
    message: "Book is found",
    data: JSON.parse(bookKey),
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

  await client.set(`book:${bookId}`, JSON.stringify(updateBook));

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
