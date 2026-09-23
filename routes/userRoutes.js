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

const router = express.Router();

router.use(protect);

router.get("/getAllOrders", getRateLimiter, protect, getUserOrders);
router.get("/allusers", getRateLimiter, restrictTo("admin"), allUser);
router.post("/favBooks", mutationLimiter, userFavBooks);
router.get("/me", getRateLimiter, protect, me);
router.patch("/updateMe", mutationLimiter, protect, updateUserInfo);
router.get("/:userId", validateId("userId"), getRateLimiter, getUser);

export default router;
