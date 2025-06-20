import Order from "../models/orderModel.js";

import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import client from "../config/redisClient.js";

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

  const orderData = await client.get(`order:${orderId}`);
  if (!orderData) {
    if (!orderId) {
      return next(new AppError("Order id not found", 404));
    }

    const order = await Order.findById(orderId);
    await client.set(`order:${orderId}`, JSON.stringify(order));

    return res.status(200).json({
      status: "success",
      data: order,
    });
  }

  res.status(200).json({
    status: "success",
    data: JSON.parse(orderData),
  });
});

export { getAllOrders, getOneOrder };
