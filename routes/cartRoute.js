import express from "express";
import {
  addToCart,
  getCart,
  removeBookFromCart,
} from "../controllers/cartController.js";

import { protect } from "../controllers/authController.js";
import restrictTo from "../middlewares/protect.js";

import { getRateLimiter, mutationLimiter } from "../middlewares/ratelimiter.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("user"));

router.get("/getCart", getRateLimiter, getCart);
router.post("/addToCart", mutationLimiter, addToCart);
router.post("/removeBookFromCart/:bookId", mutationLimiter, removeBookFromCart);

export default router;
