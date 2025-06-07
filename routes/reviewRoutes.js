import express from "express";
import {
  createReview,
  getAllBooksReviews,
} from "../controllers/reviewController.js";
import { protect } from "../controllers/authController.js";

const routes = express.Router({ mergeParams: true });

routes.use(protect);
routes.route("/").get(getAllBooksReviews).post(createReview);

export default routes;
