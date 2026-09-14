import { Router } from "express";
import { getAllWishlist } from "../controllers/wishlistController.js";

import { protect } from "../controllers/authController.js";

const routes = Router();

// for protecting routes
routes.use(protect);

routes.get("/", getAllWishlist);

export default routes;
