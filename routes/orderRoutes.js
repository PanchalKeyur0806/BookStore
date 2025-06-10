import express from "express";

import makeReservation from "../middlewares/makeReservation.js";

import {
  createAndSendInvoices,
  createCheckoutSession,
  refundPaymnet,
  success,
} from "../controllers/paymentController.js";

import { protect } from "../controllers/authController.js";
import checkRefundStatus from "../middlewares/checkRefundStatus.js";
import { getAllOrders, getOneOrder } from "../controllers/orderController.js";

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

// order details
routes.get("/allorders", getAllOrders);
routes.get("/order/:orderId", getOneOrder);

routes.get("/success", success);

export default routes;
