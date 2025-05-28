import express from "express";

import { createBooks } from "../controllers/booksController.js";

const router = express.Router();

router.route("/createBook").post(createBooks);

export default router;
