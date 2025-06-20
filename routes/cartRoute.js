import express from "express";
import {
  addToCart,
  getCart,
  removeBookFromCart,
} from "../controllers/cartController.js";

import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.get("/getCart", getCart);
router.post("/addToCart", addToCart);
router.post("/removeBookFromCart/:bookId", removeBookFromCart);

export default router;
