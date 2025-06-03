import Order from "../models/orderModel.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../../urlshortener/utils/catchAsync.js";
import { check } from "express-validator";

const checkRefundStatus = catchAsync(async (req, res, next) => {
  const { stripePaymentId } = req.params;
  if (!stripePaymentId) {
    return next(new AppError("Payment Id not found", 404));
  }

  const order = await Order.findOne({
    "paymentInfo.stripePaymentId": stripePaymentId,
  });

  //   today Date
  const todayDate = new Date();
  const paidAt = new Date(order.paymentInfo.paidAt);
  const cancelationDate = new Date(paidAt.getTime() + 24 * 60 * 60 * 1000);

  if (todayDate > cancelationDate) {
    return next(
      new AppError("date is passed, you can't make a refund request", 400)
    );
  }

  next();
});

export default checkRefundStatus;
