import Order from "../models/orderModel.js";

import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const checkRefundStatus = catchAsync(async (req, res, next) => {
  const { stripePaymentId } = req.params;
  if (!stripePaymentId) {
    return next(new AppError("Payment Id not found", 404));
  }

  const userId = req.user._id;

  const order = await Order.findOne({
    "paymentInfo.stripePaymentId": stripePaymentId,
    user: userId,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  //   today Date
  const todayDate = new Date();
  const paidAt = new Date(order.paymentInfo.paidAt);
  const cancelationDate = new Date(paidAt.getTime() + 168 * 60 * 60 * 1000);

  if (todayDate > cancelationDate) {
    return next(
      new AppError("date is passed, you can't make a refund request", 400),
    );
  }

  // only allows order to be refunded, when order status is paid
  if (order.orderStatus !== "paid") {
    return next(new AppError("This payment cannot be refunded", 400));
  }

  req.order = order;

  next();
});

export default checkRefundStatus;
