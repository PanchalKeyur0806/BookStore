import express from "express";
import {
  deactiveUser,
  getDashboard,
  getSalesAnalytics,
} from "../controllers/adminController.js";
import restrictTo from "../middlewares/protect.js";
import { protect } from "../controllers/authController.js";

const routes = express.Router();

routes.use(protect);
routes.use(restrictTo("admin"));

routes.get("/getDashboard", getDashboard);
routes.get("/getSalesAnalytics", getSalesAnalytics);
routes.get("/deactivateUser", deactiveUser);
export default routes;
