import express from "express";
import {
  createReview,
  deleteReview,
  getAllBooksReviews,
  getAllReviews,
  getOneReview,
  updateReview,
} from "../controllers/reviewController.js";
import { protect } from "../controllers/authController.js";
import { updateBook } from "../controllers/booksController.js";
import restrictTo from "../middlewares/protect.js";

import {
  getRateLimiter,
  mutationLimiter,
  generalRateLimiter,
} from "../middlewares/ratelimiter.js";

const routes = express.Router({ mergeParams: true });

routes.use(protect);

routes
  .route("/")
  .get(getRateLimiter, getAllBooksReviews)
  .post(mutationLimiter, restrictTo("user"), createReview)
  .patch(mutationLimiter, restrictTo("user"), updateReview)
  .delete(generalRateLimiter, restrictTo("user"), deleteReview);

routes.get("/allReviews", getRateLimiter, restrictTo("admin"), getAllReviews);

routes.get("/:bookId/me", getRateLimiter, restrictTo("user"), getOneReview);

export default routes;
