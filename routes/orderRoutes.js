import express from "express";

import {
  createCheckoutSession,
  success,
} from "../controllers/orderController.js";

import { protect } from "../controllers/authController.js";

const routes = express.Router();

routes.post("/createcheckoutsession", protect, createCheckoutSession);
routes.get("/success", success);

export default routes;
