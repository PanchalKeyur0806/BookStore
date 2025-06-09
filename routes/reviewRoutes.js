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

const routes = express.Router({ mergeParams: true });

routes.use(protect);
routes
  .route("/")
  .get(getAllBooksReviews)
  .post(createReview)
  .patch(updateReview)
  .delete(deleteReview);

routes.get("/allReviews", getAllReviews);

routes.get("/:bookId/me", getOneReview);

export default routes;
