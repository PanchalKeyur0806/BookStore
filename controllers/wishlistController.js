// import model
import Wishlist from "../models/wishlistModel.js";

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
    data: {
      wishlist,
    },
  });
});
