import express from "express";
import {
  addToCart,
  removeBookFromCart,
} from "../controllers/cartController.js";

import { protect } from "../controllers/authController.js";

const router = express.Router();

router.post("/addToCart", protect, addToCart);
router.post("/removeBookFromCart", protect, removeBookFromCart);

export default router;
