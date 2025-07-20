import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "../models/reviewModel.js";
import { faker } from "@faker-js/faker";
import User from "../models/userModel.js";
import Books from "../models/booksModel.js";

dotenv.config({ path: "../.env" });
mongoose
  .connect(process.env.DB_STRING)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB error:", err));

async function generateReview() {
  const users = await User.find({}, "_id");
  const books = await Books.find({}, "_id");

  if (users.length <= 0) {
    return console.error("Users not found");
  }
  if (books.length <= 0) {
    return console.error("Users not found");
  }

  const randomUser = users[Math.floor(Math.random() * users.length)];
  const randomBook = books[Math.floor(Math.random() * Books.length)];

  console.log(randomUser);

  return {
    review: faker.lorem.sentence(),
    user: randomUser,
    book: randomBook,
    rating: faker.number.int({ min: 1, max: 5 }),
  };
}

async function seedReviews() {
  try {
    const fakeReviews = await Promise.all(
      Array.from({ length: 20 }, () => generateReview())
    );

    await Review.insertMany(fakeReviews);
    console.log("Data inserted successfully");
  } catch (error) {
    console.log(error);
  }
}

seedReviews();
