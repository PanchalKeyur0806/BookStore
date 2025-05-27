import express from "express";

import { protect } from "../controllers/authController.js";
import { allUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/allusers", protect, allUser);

export default router;
