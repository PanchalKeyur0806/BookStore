import express from "express";

import uploads from "../config/multerConfig.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import {
  createBooks,
  deleteBook,
  getAllBooks,
  getOneBook,
  updateBook,
} from "../controllers/booksController.js";
import { validateBooks } from "../middlewares/validateBooks.js";
import restrictTo from "../middlewares/protect.js";
import { protect } from "../controllers/authController.js";

import {
  getRateLimiter,
  mutationLimiter,
  generalRateLimiter,
} from "../middlewares/ratelimiter.js";
import { validateId } from "../middlewares/validateId.js";

const router = express.Router();

router.use("/:bookId/review", reviewRoutes);

router
  .route("/")
  .get(getRateLimiter, getAllBooks)
  .post(
    mutationLimiter,
    uploads.single("coverImage"),
    validateBooks,
    createBooks,
  );

router
  .route("/:bookId")
  .get(getRateLimiter, getOneBook)
  .patch(
    mutationLimiter,
    validateId("bookId"),
    uploads.single("coverImage"),
    protect,
    restrictTo("admin"),
    updateBook,
  )
  .delete(protect, generalRateLimiter, restrictTo("admin"), deleteBook);

export default router;
