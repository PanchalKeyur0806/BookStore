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
import restrictTo from "../middlewares/protect.js";

const routes = express.Router();

routes.post(
  "/createcheckoutsession",
  protect,
  restrictTo("user"),
  makeReservation,
  createCheckoutSession
);

routes.get("/getInvoices", protect, createAndSendInvoices);

routes.get(
  "/refundPayment/:stripePaymentId",
  protect,
  restrictTo("user"),
  checkRefundStatus,
  refundPaymnet
);

// order details
routes.get("/allorders", restrictTo("admin"), getAllOrders);
routes.get("/order/:orderId", restrictTo("user", "admin"), getOneOrder);

routes.get("/success", success);

export default routes;
