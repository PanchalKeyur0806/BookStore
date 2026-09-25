import { Worker } from "bullmq";
import sendEmail from "../utils/nodemailer.js";

import orderCreatedTemplate from "../utils/emailTemplates/orderTemplate.js";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    try {
      const order = job.data.data;

      // check that server is in production mode
      const userEmail =
        process.env.NODE_ENV === "production"
          ? job.data.data.shippingAddress.email
          : process.env.USER_EMAIL;

      const html = orderCreatedTemplate({
        name: order.shippingAddress.name,
        orderId: order._id,
        totalQuantity: order.totalQuantity,
        totalPrice: order.totalPrice,
        shippingAddress: order.shippingAddress,
      });

      await sendEmail({
        email: userEmail,
        subject: "Your BookStore order has been created",
        message: `Your order ${order._id} has been successfully created. Total amount: ₹${order.totalPrice}.`,
        html,
      });
    } catch (error) {
      console.log("failed to send email to client");
      console.log("Some error occured ", error);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT) || 6379,
    },
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: Error: ${err}\n${err.message}`);
});
