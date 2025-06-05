import Review from "../models/reviewModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const createReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;
  const { bookId } = req.params;

  res.status(200).json({
    status: "success",
    message: "Review created successfully",
  });
});

export { createReview };
