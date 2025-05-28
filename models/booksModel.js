import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book must have a name"],
    trime: true,
  },
  author: {
    type: String,
    required: [true, "Book must have a author"],
  },
  stock: {
    type: Number,
    required: [true, "Books must have a stock"],
  },
  description: {
    type: String,
    required: [true, "Book must have a description"],
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Book must have a price"],
    default: 0,
  },
  category: {
    type: String,
    enum: [
      "Fantasy",
      "Action",
      "Adventure",
      "Mystery",
      "Horror",
      "Thriller",
      "Romance",
      "Self-help",
      "Biography",
    ],
    required: [true, "please provide valid category"],
  },
  coverImage: {
    type: String,
    required: [true, "Book must have a coverImage"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Books = mongoose.model("Books", bookSchema);

export default Books;
