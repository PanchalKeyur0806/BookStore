import express from "express";
import { allUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/allusers", allUser);

export default router;
