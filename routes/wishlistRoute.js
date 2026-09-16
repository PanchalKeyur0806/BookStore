import { Router } from "express";
import {
  addToWishlist,
  getAllWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import { protect } from "../controllers/authController.js";
import { validateId } from "../middlewares/validateId.js";

// importing rate limiting
import {
  getRateLimiter,
  mutationLimiter,
  generalRateLimiter,
} from "../middlewares/ratelimiter.js";

const routes = Router();

// for protecting routes
routes.use(protect);

// all the routes
routes.get("/", getRateLimiter, getAllWishlist);
routes.post("/:bookId", mutationLimiter, validateId("bookId"), addToWishlist);
routes.delete(
  "/:bookId",
  generalRateLimiter,
  validateId("bookId"),
  removeFromWishlist,
);

export default routes;
