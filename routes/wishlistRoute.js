import { Router } from "express";
import {
  addToWishlist,
  getAllWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import { protect } from "../controllers/authController.js";
import { validateId } from "../middlewares/validateId.js";

const routes = Router();

// for protecting routes
routes.use(protect);

routes.get("/", getAllWishlist);
routes.post("/:bookId", validateId("bookId"), addToWishlist);
routes.delete("/:bookId", validateId("bookId"), removeFromWishlist);

export default routes;
