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

const router = express.Router();

router.use(protect);

router.get("/getAllOrders", restrictTo("user"), getUserOrders);
router.get("/allusers", restrictTo("admin"), allUser);
router.post("/favBooks", userFavBooks);
router.get("/me", protect, me);
router.patch("/updateMe", protect, updateUserInfo);
router.get("/:userId", getUser);

export default router;
