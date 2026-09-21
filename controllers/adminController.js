import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Books from "../models/booksModel.js";
import Review from "../models/reviewModel.js";
import Wishlist from "../models/wishlistModel.js";

function categoryCommonAggregation() {
  return [
    {
      $match: {
        orderStatus: {
          $ne: "cancelled",
        },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "books",
        localField: "items.book",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $unwind: "$book",
    },
  ];
}

export const getDashboard = catchAsync(async (req, res, next) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const last30days = new Date(today.setDate(today.getDate() - 30));

  const salesData = await Order.aggregate([
    {
      $facet: {
        // total revenue
        totalRevenue: [
          {
            $match: {
              orderStatus: { $ne: "cancelled" },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalPrice" },
            },
          },
        ],

        // total orders, including cancelled
        totalOrders: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],

        // total books
        totalBooks: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],

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
    "title author stock",
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
export const getSalesAnalytics = catchAsync(async (req, res, next) => {
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
export const deactiveUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new AppError("User id not found", 404));
  }

  const user = await User.findByIdAndUpdate(userId, { isActive: false }).select(
    "-password",
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

// for book analytics
export const bookAnalytics = catchAsync(async (req, res, next) => {
  // sales by each book
  const booksAnalytic = await Books.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalActiveBooks: {
          $sum: {
            $cond: [{ $ne: ["$isDeleted", true] }, 1, 0],
          },
        },
        totalInactiveBooks: {
          $sum: {
            $cond: [{ $ne: ["$isDeleted", false] }, 1, 0],
          },
        },
        outOfStockBooks: {
          $sum: {
            $cond: [{ $eq: ["$stock", 0] }, 1, 0],
          },
        },
        lowStockBooks: {
          $sum: {
            $cond: [{ $lt: ["$stock", 100] }, 1, 0],
          },
        },
      },
    },
  ]);

  const bookSaleAnalytics = await Order.aggregate([
    {
      $match: {
        orderStatus: { $ne: "cancelled" },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.book",
        totalSold: {
          $sum: "$items.quantity",
        },
        totalOrders: {
          $sum: 1,
        },
      },
    },
    {
      $facet: {
        bestSellingBooks: [
          {
            $sort: {
              totalSold: -1,
            },
          },
          {
            $limit: 10,
          },
          {
            $lookup: {
              from: "books",
              localField: "_id",
              foreignField: "_id",
              as: "book",
            },
          },
        ],

        lowSellingBooks: [
          {
            $sort: {
              totalSold: 1,
            },
          },
          {
            $limit: 10,
          },
          {
            $lookup: {
              from: "books",
              localField: "_id",
              foreignField: "_id",
              as: "book",
            },
          },
        ],
      },
    },
    {
      $project: {
        bestSellingBooks: 1,
        lowSellingBooks: 1,
      },
    },
  ]);

  const bookReviewAnalytics = await Review.aggregate([
    {
      $group: {
        _id: "$book",
        totalRating: {
          $sum: "$rating",
        },
        reviewCount: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
    {
      $facet: {
        mostRatedBook: [
          {
            $sort: {
              totalRating: -1,
            },
          },
          {
            $limit: 10,
          },
        ],
        highestRatedBook: [
          {
            $sort: {
              avgRating: -1,
            },
          },
          {
            $limit: 10,
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    stauts: "success",
    data: { booksAnalytic, bookSaleAnalytics, bookReviewAnalytics },
  });
});

// controller for tracking every book performance
export const bookPerformance = catchAsync(async (req, res, nex) => {
  const allBooksPerofrmance = await Books.aggregate([
    // get the book analytics for all books
    // total number of copy sold
    // total revenue of each book
    {
      $lookup: {
        from: "orders",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              orderStatus: {
                $ne: "cancelled",
              },
            },
          },
          {
            $unwind: "$items",
          },
          {
            $match: {
              $expr: {
                $eq: ["$items.book", "$$bookId"],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSold: {
                $sum: "$items.quantity",
              },
              totalRevenue: {
                $sum: "$totalPrice",
              },
            },
          },
        ],
        as: "orderAnalytics",
      },
    },

    // get total wishlist count of each book
    {
      $lookup: {
        from: "wishlists",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$book", "$$bookId"],
              },
            },
          },
          {
            $count: "totalWishlistCount",
          },
        ],
        as: "wishlistAnalytics",
      },
    },

    // get the total rating of each book
    {
      $lookup: {
        from: "reviews",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$book", "$$bookId"],
              },
            },
          },
          {
            $group: {
              _id: "$book",
              averageRating: { $avg: "$rating" },
            },
          },
        ],
        as: "bookRating",
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: allBooksPerofrmance,
  });
});

export const bookCategorySales = catchAsync(async (req, res, next) => {
  const categoryRevenue = await Order.aggregate([
    // filter all the document
    ...categoryCommonAggregation(),

    // group together all the category and calculate sales & revenue
    {
      $group: {
        _id: "$book.category",
        getSales: {
          $sum: "$items.quantity",
        },
        getRevenue: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // return response
  res.status(200).json({
    status: "success",
    data: categoryRevenue,
  });
});

export const categorySalesTrend = catchAsync(async (req, res, next) => {
  const categoryTrendAnalytics = await Order.aggregate([
    ...categoryCommonAggregation(),
    // group all the books together by category, month, year
    {
      $group: {
        _id: {
          category: "$book.category",
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        totalQuantity: {
          $sum: "$items.quantity",
        },
        totalRevenue: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // return the response
  res.status(200).json({
    status: "success",
    data: categoryTrendAnalytics,
  });
});

export const orderAnalytics = catchAsync(async (req, res, next) => {
  const orderStatusAnalytics = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        totalOrders: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        orderStatus: "$_id",
        totalOrders: 1,
      },
    },
  ]);

  const orderCancellationAnalytics = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        cancelledOrders: {
          $sum: {
            $cond: [
              {
                $eq: ["$orderStatus", "cancelled"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        cancelledOrders: 1,
        cancellationRate: {
          $multiply: [
            {
              $divide: ["$cancelledOrders", "$totalOrders"],
            },
            100,
          ],
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { orderStatusAnalytics, orderCancellationAnalytics },
  });
});

export const orderGrowth = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  // check the start date and end date
  if (!startDate || !endDate) {
    return next(new AppError("Please enter start and end date", 400));
  }

  // convert dates to correct format
  const start = new Date(startDate);
  const end = new Date(endDate);

  // check date validations
  if (start > end) {
    return next(new AppError("Please Enter valid start and end date", 400));
  }

  // convert date to ms
  const dateInMS = end - start;
  const differenceDate = dateInMS / (1000 * 60 * 60 * 24);

  // check date validation
  if (differenceDate > 90) {
    return next(
      new AppError("Difference of date should not be bigger than 90 days", 400),
    );
  }

  // get order growth analytics
  const orderGrowthAnalytic = await Order.aggregate([
    // get the documents between start and end
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    // group together same all the document by same day
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: "$createdAt",
            unit: "day",
          },
        },
        totalOrders: { $sum: 1 },
      },
    },
    // select only necessory dates
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalOrders: 1,
      },
    },
    // create a field that generates the dates
    {
      $densify: {
        field: "date",
        range: {
          bounds: [start, end],
          step: 1,
          unit: "day",
        },
      },
    },
    // fill the values to each date
    {
      $fill: {
        sortBy: {
          date: 1,
        },
        output: {
          totalOrders: {
            value: 0,
          },
        },
      },
    },
    // sort the data
    {
      $sort: { date: 1 },
    },
  ]);

  // return the reponse
  res.status(200).json({
    status: "success",
    data: orderGrowthAnalytic,
  });
});

export const averageOrderValueAnalytics = catchAsync(async (req, res, next) => {
  // get the start date and end date from the query
  const { startDate, endDate } = req.query;

  // check if startDate and endDate exists
  if (!startDate || !endDate) {
    return next(new AppError("please enter start and end date", 400));
  }

  // convert string to date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // check validation
  if (isNaN(start) || isNaN(end)) {
    return next(new AppError("please enter valid dates", 400));
  }

  if (end <= start) {
    return next(new AppError("End date must be after start date", 400));
  }

  // get the difference of 1 year
  const oneYearLater = new Date(start);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  // check that end date and 1 year is same, if not return error
  if (end.getTime() !== oneYearLater.getTime()) {
    return next(
      new AppError(
        "Start date and end date must have difference of exactly 1 year",
        400,
      ),
    );
  }

  const avgOrderAnalytic = await Order.aggregate([
    // find the orders that have been delivered and should be in range of startDate and endDate
    {
      $match: {
        orderStatus: "delivered",
        createdAt: { $gte: start, $lte: oneYearLater },
      },
    },
    // group all the documents together by month
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: "$createdAt",
            unit: "month",
          },
        },
        completedOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    // create a additional dummy data, if data doesn't exists on database
    {
      $densify: {
        field: "_id",
        range: {
          bounds: [start, oneYearLater],
          step: 1,
          unit: "month",
        },
      },
    },
    // fill those data
    {
      $fill: {
        sortBy: { _id: 1 },
        output: {
          completedOrders: {
            value: 0,
          },
          totalRevenue: {
            value: 0,
          },
        },
      },
    },
    // only get required fields
    {
      $project: {
        _id: 0,
        month: {
          $dateToString: {
            format: "%Y-%m",
            date: "$_id",
          },
        },
        completedOrders: 1,
        totalRevenue: 1,
        avgOrderValue: {
          $cond: [
            {
              $gt: ["$completedOrders", 0],
            },
            {
              $round: [{ $divide: ["$totalRevenue", "$completedOrders"] }, 2],
            },
            0,
          ],
        },
      },
    },
    // sort all data
    {
      $sort: { month: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: avgOrderAnalytic,
  });
});

export const customerAnalytics = catchAsync(async (req, res, next) => {
  const userAnalytics = await User.aggregate([
    {
      $group: {
        _id: {
          // $month: "$createdAt",
          $dateToString: {
            format: "%B",
            date: "$createdAt",
          },
        },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalUsers: 1,
      },
    },
  ]);

  const topPayingCustomers = await Order.aggregate([
    {
      $match: {
        orderStatus: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: "$user",
        totalOrders: { $sum: 1 },
        totalMoneySpent: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: {
        totalMoneySpent: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  const returningCustomers = await Order.aggregate([
    {
      $match: { orderStatus: { $eq: "delivered" } },
    },
    {
      $group: {
        _id: "$user",
        totalOrder: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        returningCustomers: {
          $sum: {
            $cond: [{ $gt: ["$totalOrder", 1] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalCustomers: 1,
        returningCustomers: 1,
        returningCustomersRate: {
          $cond: [
            { $eq: ["$totalCustomers", 0] },
            0,
            {
              $multiply: [
                {
                  $divide: ["$returningCustomers", "$totalCustomers"],
                },
                100,
              ],
            },
          ],
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { userAnalytics, topPayingCustomers, returningCustomers },
  });
});

export const deadMovingStocks = catchAsync(async (req, res, next) => {
  const deadMovingStockAnalytics = await Books.aggregate([
    {
      $lookup: {
        from: "orders",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              orderStatus: "delivered",
              createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $unwind: "$items",
          },
          {
            $match: {
              $expr: {
                $eq: ["$items.book", "$$bookId"],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSold: { $sum: "$items.quantity" },
            },
          },
        ],
        as: "sales",
      },
    },
    {
      $addFields: {
        totalSold: {
          $ifNull: [
            {
              $arrayElemAt: ["$sales.totalSold", 0],
            },
            0,
          ],
        },
      },
    },
    {
      $match: {
        totalSold: 0,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        stock: 1,
        author: 1,
        price: 1,
        totalSold: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: deadMovingStockAnalytics,
  });
});

export const paymentAnalytics = catchAsync(async (req, res, next) => {
  const paymentStatusAnalytics = await Order.aggregate([
    {
      $group: {
        _id: null,
        successfullPayments: {
          $sum: {
            $cond: [{ $eq: ["$paymentInfo.status", "paid"] }, 1, 0],
          },
        },
        successfullAmounts: {
          $sum: {
            $cond: [{ $eq: ["$paymentInfo.status", "paid"] }, "$totalPrice", 0],
          },
        },
        failedPayments: {
          $sum: {
            $cond: [{ $eq: ["$paymentInfo.status", "failed"] }, 1, 0],
          },
        },
        failedAmounts: {
          $sum: {
            $cond: [
              { $eq: ["$paymentInfo.status", "failed"] },
              "$totalPrice",
              0,
            ],
          },
        },
        refundedPayments: {
          $sum: {
            $cond: [{ $eq: ["$paymentInfo.status", "cancelled"] }, 1, 0],
          },
        },
        refundedAmounts: {
          $sum: {
            $cond: [
              { $eq: ["$paymentInfo.status", "cancelled"] },
              "$totalPrice",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const paymentStatusRate = await Order.aggregate([
    {
      $group: {
        _id: null,
        successfullPayments: {
          $sum: {
            $cond: [
              { $in: ["$paymentInfo.status", ["paid", "cancelled"]] },
              1,
              0,
            ],
          },
        },
        failedPayments: {
          $sum: {
            $cond: [{ $eq: ["$paymentInfo.status", "failed"] }, 1, 0],
          },
        },
        totalPayments: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        successfullPayments: 1,
        failedPayments: 1,
        totalPayments: 1,
        successRate: {
          $multiply: [
            {
              $divide: ["$successfullPayments", "$totalPayments"],
            },
            100,
          ],
        },
        failedRate: {
          $multiply: [
            {
              $divide: ["$failedPayments", "$totalPayments"],
            },
            100,
          ],
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { paymentStatusAnalytics, paymentStatusRate },
  });
});
