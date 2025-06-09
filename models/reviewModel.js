import mongoose from "mongoose";
import Books from "./booksModel.js";

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, "review is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Books",
      required: [true, "book is required"],
    },
    rating: {
      type: Number,
      min: [1, "min 1 rating is required"],
      max: [5, "max 5 rating is required"],
      required: [true, "rating is required"],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, book: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  }).populate({
    path: "book",
    select: "title",
  });

  next();
});

// calculate average rating
reviewSchema.statics.calcAvgRating = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "$book",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Books.findByIdAndUpdate(bookId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Books.findByIdAndUpdate(bookId, {
      ratingQuantity: 0,
      ratingAverage: 0,
    });
  }
};

// calculate average rating after the posting review
reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.book);
});

// calculate average rating after updating the review
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAvgRating(doc.book._id);
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
