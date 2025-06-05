import express from "express";
import { createReview } from "../controllers/reviewController.js";

const routes = express.Router();

routes.post("/:bookId/review", createReview);

export default routes;
