import express from "express";
import {
  addToCart,
  getCart,
  removeBookFromCart,
} from "../controllers/cartController.js";

import { protect } from "../controllers/authController.js";
import restrictTo from "../middlewares/protect.js";

import { getRateLimiter, mutationLimiter } from "../middlewares/ratelimiter.js";
import { validateId } from "../middlewares/validateId.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("user"));

router.get("/", getRateLimiter, getCart);
router.post("/add", mutationLimiter, addToCart);
router.post(
  "/remove/:bookId",
  mutationLimiter,
  validateId("bookId"),
  removeBookFromCart,
);

export default router;
