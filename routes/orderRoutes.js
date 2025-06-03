import express from "express";

import makeReservation from "../middlewares/makeReservation.js";

import {
  createCheckoutSession,
  refundPaymnet,
  success,
} from "../controllers/orderController.js";

import { protect } from "../controllers/authController.js";
import checkRefundStatus from "../middlewares/checkRefundStatus.js";

const routes = express.Router();

routes.post(
  "/createcheckoutsession",
  protect,
  makeReservation,
  createCheckoutSession
);

routes.all("/refundPayment/:stripePaymentId", checkRefundStatus, refundPaymnet);

routes.get("/success", success);

export default routes;
