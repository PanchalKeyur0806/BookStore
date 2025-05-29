import express from "express";

import { createCheckoutSession } from "../controllers/orderController.js";

import { protect } from "../controllers/authController.js";

const routes = express.Router();

routes.post("/createcheckoutsession", protect, createCheckoutSession);

export default routes;
