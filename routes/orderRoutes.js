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

import { getRateLimiter, mutationLimiter } from "../middlewares/ratelimiter.js";

const routes = express.Router();

routes.post(
  "/createcheckoutsession",
  mutationLimiter,
  protect,
  restrictTo("user"),
  makeReservation,
  createCheckoutSession,
);

routes.get("/getInvoices", getRateLimiter, protect, createAndSendInvoices);

routes.get(
  "/refundPayment/:stripePaymentId",
  protect,
  restrictTo("user"),
  checkRefundStatus,
  refundPaymnet,
);

// order details
routes.get(
  "/allorders",
  getRateLimiter,
  protect,
  restrictTo("admin"),
  getAllOrders,
);
routes.get(
  "/order/:orderId",
  getRateLimiter,
  protect,
  restrictTo("user", "admin"),
  getOneOrder,
);

routes.get("/success", success);

export default routes;
