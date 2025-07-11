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

const router = express.Router();

router.use("/:bookId/review", reviewRoutes);

router
  .route("/")
  .get(getAllBooks)
  .post(uploads.single("coverImage"), validateBooks, createBooks);

router
  .route("/:bookId")
  .get(getOneBook)
  .patch(restrictTo("admin"), updateBook)
  .delete(restrictTo("admin"), deleteBook);

export default router;
