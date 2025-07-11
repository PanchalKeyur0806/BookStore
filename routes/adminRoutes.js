import express from "express";
import {
  deactiveUser,
  getDashboard,
  getSalesAnalytics,
} from "../controllers/adminController.js";
import restrictTo from "../middlewares/protect.js";

const routes = express.Router();

routes.use(restrictTo("admin"));

routes.get("/getDashboard", getDashboard);
routes.get("/getSalesAnalytics", getSalesAnalytics);
routes.get("/deactivateUser", deactiveUser);
export default routes;
