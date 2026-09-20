import express from "express";
import {
  deactiveUser,
  getDashboard,
  getSalesAnalytics,
  bookAnalytics,
  bookPerformance,
  bookCategorySales,
  categorySalesTrend,
  orderAnalytics,
  customerAnalytics,
  deadMovingStocks,
} from "../controllers/adminController.js";
import restrictTo from "../middlewares/protect.js";
import { protect } from "../controllers/authController.js";

import { getRateLimiter } from "../middlewares/ratelimiter.js";

const routes = express.Router();

routes.use(protect);
routes.use(restrictTo("admin"));

routes.get("/getDashboard", getRateLimiter, getDashboard);
routes.get("/getSalesAnalytics", getRateLimiter, getSalesAnalytics);
routes.get("/book/analytics", bookAnalytics);
routes.get("/book/deadstock", deadMovingStocks);
routes.get("/book/performance", bookPerformance);
routes.get("/book/category/revenue", bookCategorySales);
routes.get("/book/category/trend", categorySalesTrend);
routes.get("/order/analytics", orderAnalytics);
routes.get("/customer/analytics", customerAnalytics);
routes.get("/deactivateUser", getRateLimiter, deactiveUser);

export default routes;
