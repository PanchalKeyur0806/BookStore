import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Books from "../models/booksModel.js";

const getDashboard = catchAsync(async (req, res, next) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const last30days = new Date(today.setDate(today.getDate() - 30));

  const salesData = await Order.aggregate([
    {
      $facet: {
        // total sales this month
        monthlyTotal: [
          {
            $match: {
              createdAt: { $gte: startOfMonth },
              status: { $ne: "cancelled" },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalPrice" },
              count: { $sum: 1 },
            },
          },
        ],

        // total sales  in this year
        yearlyTotal: [
          {
            $match: {
              createdAt: { $gte: startOfYear },
              status: { $ne: "cancelled" },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalPrice" },
              count: { $sum: 1 },
            },
          },
        ],

        // daily sales
        dailySales: [
          {
            $match: {
              createdAt: { $gte: last30days },
              status: { $ne: "cancelled" },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              sales: { $sum: "$totalPrice" },
              count: { $sum: 1 },
            },
          },
        ],

        //   top books
        topBooks: [
          { $match: { status: { $ne: "cancelled" } } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.book",
              title: { $first: "$items.title" },
              totalSold: { $sum: "$items.quantity" },
              // revenue: { $sum: "" },
            },
          },
          {
            $sort: { totalSold: 1 },
          },
        ],
      },
    },
  ]);

  //   user stats
  const userStats = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: "count" }],
        newUserThisMonth: [
          { $match: { createdAt: { $gte: startOfMonth } } },
          { $count: "count" },
        ],
        userByRoles: [
          {
            $match: { role: { $ne: "admin" } },
          },
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  //   order statectis
  const orderStats = await Order.aggregate([
    {
      $facet: {
        orderByStatus: [
          { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
        ],

        pendingOrders: [
          { $match: { orderStatus: { $in: ["pending", "paid"] } } },
          { $count: "count" },
        ],
      },
    },
  ]);

  //   inventory alerts
  const lowInventory = await Books.find({ stock: { $lte: 130 } }).select(
    "title author stock"
  );

  res.status(200).json({
    status: "success",
    salesData,
    userStats,
    orderStats,
    lowInventory,
  });
});

export { getDashboard };
