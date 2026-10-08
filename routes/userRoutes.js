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
import { validateId } from "../middlewares/validateId.js";
import { validateUser } from "../middlewares/validateUser.js";

const router = express.Router();

router.use(protect);

router.get("/orders", getRateLimiter, getUserOrders);
router.get("/all", getRateLimiter, restrictTo("admin"), allUser);
router.post("/favBooks", mutationLimiter, userFavBooks);
router.get("/me", getRateLimiter, protect, me);
router.patch("/updateMe", mutationLimiter, protect, validateUser, updateUserInfo);
router.get(
  "/:userId",
  getRateLimiter,
  validateId("userId"),
  restrictTo("admin"),
  getUser,
);

export default router;
