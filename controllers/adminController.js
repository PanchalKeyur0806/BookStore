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
              orderStatus: { $ne: "cancelled" },
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
              orderStatus: { $ne: "cancelled" },
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
              orderStatus: { $ne: "cancelled" },
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
          { $match: { orderStatus: { $ne: "cancelled" } } },
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
            $sort: { totalSold: -1 },
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

// get sales analytics
const getSalesAnalytics = catchAsync(async (req, res, next) => {
  const { startDate, endDate, groupBy = "day" } = req.query;

  // match stage
  const matchStage = {
    orderStatus: { $ne: "cancelled" },
  };

  // if startDate and endDate exists
  // set the match stage according to startDate and endDate
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // declare the date format
  let dateFormat;
  // check groupBy
  switch (groupBy) {
    case "month":
      dateFormat = "%Y-%m";
      break;

    case "week":
      dateFormat = "%Y-W%U";
      break;

    default:
      dateFormat = "%Y-%m-%d";
      break;
  }

  // create a analytics variable
  const analytics = await Order.aggregate([
    // matches by matchStage
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        totalRevenue: { $sum: "$totalPrice" },
        avgRevenue: { $avg: "$totalPrice" },
        totalOrders: { $sum: 1 },
        totalItems: { $sum: { $sum: "$items.quantity" } },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  // send response to the client
  res.status(200).json({
    status: "success",
    data: analytics,
  });
});

// Disable the user
const deactiveUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new AppError("User id not found", 404));
  }

  const user = await User.findByIdAndUpdate(userId, { isActive: false }).select(
    "-password"
  );
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User is suspended",
    data: user,
  });
});
export { getDashboard, getSalesAnalytics, deactiveUser };
