import express from "express";

import { protect } from "../controllers/authController.js";
import {
  allUser,
  getUser,
  getUserOrders,
  me,
  updateUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/getAllOrders", getUserOrders);
router.get("/allusers", allUser);
router.get("/me", protect, me);
router.patch("/updateMe", protect, updateUserInfo);
router.get("/:userId", getUser);

export default router;
