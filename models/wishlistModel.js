import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Wishlist must belong to a user"],
  },

  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
    required: [true, "Wishlist must contain a book"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// index for wishlist
wishlistSchema.index({ user: 1, book: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
