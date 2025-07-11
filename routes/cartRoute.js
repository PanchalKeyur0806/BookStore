import express from "express";
import {
  addToCart,
  getCart,
  removeBookFromCart,
} from "../controllers/cartController.js";

import { protect } from "../controllers/authController.js";
import restrictTo from "../middlewares/protect.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("user"));

router.get("/getCart", getCart);
router.post("/addToCart", addToCart);
router.post("/removeBookFromCart/:bookId", removeBookFromCart);

export default router;
