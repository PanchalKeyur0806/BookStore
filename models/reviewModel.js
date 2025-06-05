import mongoose from "mongoose";

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
      max: [10, "max 10 rating is required"],
      required: [true, "rating is required"],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
