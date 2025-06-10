import Order from "../models/orderModel.js";

import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// get all the order
const getAllOrders = catchAsync(async (req, res, next) => {
  const allOrders = await Order.find();

  res.status(200).json({
    status: "success",
    length: allOrders.length,
    data: allOrders,
  });
});

// get One order
const getOneOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  if (!orderId) {
    return next(new AppError("Order id not found", 404));
  }

  const order = await Order.findById(orderId);

  res.status(200).json({
    status: "success",
    data: order,
  });
});

export { getAllOrders, getOneOrder };
