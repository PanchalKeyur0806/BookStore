import express from "express";

import { protect } from "../controllers/authController.js";
import {
  allUser,
  getUser,
  getUserOrders,
  me,
  updateUserInfo,
  userFavBooks,
} from "../controllers/userController.js";
import restrictTo from "../middlewares/protect.js";

// importing ratelimiting
import { getRateLimiter, mutationLimiter } from "../middlewares/ratelimiter.js";

const router = express.Router();

router.use(protect);

router.get("/getAllOrders", getRateLimiter, restrictTo("user"), getUserOrders);
router.get("/allusers", getRateLimiter, restrictTo("admin"), allUser);
router.post("/favBooks", mutationLimiter, userFavBooks);
router.get("/me", getRateLimiter, protect, me);
router.patch("/updateMe", mutationLimiter, protect, updateUserInfo);
router.get("/:userId", getRateLimiter, getUser);

export default router;
