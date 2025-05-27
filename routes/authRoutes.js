import express from "express";
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  protect,
} from "../controllers/authController.js";

// middlewares
import { validateRegister } from "../middlewares/validateRegister.js";
import { validateLogin } from "../middlewares/validateLogin.js";

const router = express.Router();

router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.post("/forgotpassword", protect, forgotPassword);
router.post("/resetpassword/:token", protect, resetPassword);

export default router;
