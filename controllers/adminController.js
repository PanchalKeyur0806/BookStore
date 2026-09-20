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

  res.status(200).json({
    status: "success",
    data: { userAnalytics, topPayingCustomers },
  });
});
