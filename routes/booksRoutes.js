import express from "express";

import reviewRoutes from "../routes/reviewRoutes.js";
import {
  createBooks,
  deleteBook,
  getAllBooks,
  getOneBook,
  updateBook,
} from "../controllers/booksController.js";
import { validateBooks } from "../middlewares/validateBooks.js";

const router = express.Router();

router.use("/:bookId/review", reviewRoutes);

router.route("/").get(getAllBooks).post(validateBooks, createBooks);

router.route("/:bookId").get(getOneBook).patch(updateBook).delete(deleteBook);

export default router;
