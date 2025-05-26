import express from "express";
import dotenv from "dotenv";

// all routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// global error handler
import errorHandler from "./controllers/errorController.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

export default app;
