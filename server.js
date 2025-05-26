import mongoose from "mongoose";
import app from "./index.js";

mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) =>
    console.log(`error while connecting the database ${error}`)
  );

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
