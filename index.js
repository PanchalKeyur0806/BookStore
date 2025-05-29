import express from "express";
import dotenv from "dotenv";

// all routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/booksRoutes.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoutes.js";

// global error handler
import errorHandler from "./controllers/errorController.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/orders", orderRoutes);
app.use(errorHandler);

export default app;
