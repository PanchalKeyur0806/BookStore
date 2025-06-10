import express from "express";
import {
  deactiveUser,
  getDashboard,
  getSalesAnalytics,
} from "../controllers/adminController.js";

const routes = express.Router();

routes.get("/getDashboard", getDashboard);
routes.get("/getSalesAnalytics", getSalesAnalytics);
routes.get("/deactivateUser", deactiveUser);
export default routes;
