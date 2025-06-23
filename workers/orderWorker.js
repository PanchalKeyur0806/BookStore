import dotenv from "dotenv";
import mongoose from "mongoose";
import { emailQueue } from "../queues/emailQueue.js";
import { Worker } from "bullmq";

import Books from "../models/booksModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Reservation from "../models/reservationModel.js";
import Order from "../models/orderModel.js";

dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) =>
    console.log(`error while connecting the database ${error}`)
  );

const worker = new Worker(
  "order-processing",
  async (job) => {
    const { session } = job.data;

    const user = await User.findOne({ email: session.customer_email });
    const cart = await Cart.findOne({ user: user._id });
    const reservation = await Reservation.findOne({ user: user._id });

    if (session.payment_status === "paid") {
      // save to order Db
      const order = await Order.create({
        user: user._id,
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice,
        shippingAddress: {
          name: user.name,
          email: session.customer_email,
          phoneNumber: user.phoneNumber,
          street: user.address.line,
          city: user.address.city,
          state: user.address.state,
          zipCode: user.address.zipCode,
        },
        orderStatus: "paid",
        paymentInfo: {
          stripePaymentId: session.payment_intent,
          paymentMethod: "card",
          status: "paid",
        },
      });

      // update the book sales
      const bulkOps = [];
      for (const item of cart.items) {
        const findBook = await Books.findById(item.book);
        const slaesAmount = findBook.price * item.quantity;

        bulkOps.push({
          updateOne: {
            filter: { _id: item.book },
            update: {
              $inc: { totalSales: slaesAmount, stock: -item.quantity },
            },
          },
        });
      }

      // upload bulk of data using bulkWrite
      if (bulkOps.length > 0) {
        await Books.bulkWrite(bulkOps);
        console.log("update the all book total sales");
      }

      // send email to client
      await emailQueue.add(
        "email-queue",
        {
          status: "success",
          statusCode: 200,
          data: order,
        },
        {
          attempts: 3,
        }
      );

      // delete the cart and reservation
      await Cart.findByIdAndDelete(cart._id);

      if (reservation) {
        await Reservation.findByIdAndDelete(reservation._id);
      }
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: "6379",
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: Error: ${err}\n${err.message}`);
});
