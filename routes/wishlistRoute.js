import { Router } from "express";
import {
  addToWishlist,
  getAllWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import { protect } from "../controllers/authController.js";
import { validateId } from "../middlewares/validateId.js";

// importing rate limiting
import createRateLimiter from "../middlewares/ratelimiter.js";

const routes = Router();

// for protecting routes
routes.use(protect);

// wishlist limiter
const wishlistLimiter = createRateLimiter(10000, 2);
routes.use(wishlistLimiter);

// all the routes
routes.get("/", getAllWishlist);
routes.post("/:bookId", validateId("bookId"), addToWishlist);
routes.delete("/:bookId", validateId("bookId"), removeFromWishlist);

export default routes;
