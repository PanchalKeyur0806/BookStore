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

const routes = express.Router({ mergeParams: true });

routes.use(protect);

routes
  .route("/")
  .get(getAllBooksReviews)
  .post(restrictTo("user"), createReview)
  .patch(restrictTo("user"), updateReview)
  .delete(restrictTo("user"), deleteReview);

routes.get("/allReviews", restrictTo("admin"), getAllReviews);

routes.get("/:bookId/me", restrictTo("user"), getOneReview);

export default routes;
