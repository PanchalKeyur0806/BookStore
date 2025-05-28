import express from "express";

import { protect } from "../controllers/authController.js";
import { allUser, getUser, me } from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/allusers", allUser);
router.get("/me", me);
router.get("/:userId", getUser);

export default router;
