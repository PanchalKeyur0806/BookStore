import express from "express";
import dotenv from "dotenv";

// all routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/booksRoutes.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// global error handler
import errorHandler from "./controllers/errorController.js";

import { webhook } from "./controllers/paymentController.js";

dotenv.config();

const app = express();

// webhook for payment integration
app.post("/webhook", express.raw({ type: "application/json" }), webhook);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", adminRoutes);
app.use(errorHandler);

export default app;
