import express from "express";

import makeReservation from "../middlewares/makeReservation.js";

import {
  createAndSendInvoices,
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

routes.get("/getInvoices", protect, createAndSendInvoices);

routes.get(
  "/refundPayment/:stripePaymentId",
  protect,
  checkRefundStatus,
  refundPaymnet
);

routes.get("/success", success);

export default routes;
