import dotenv from "dotenv";
import { Worker } from "bullmq";
import sendEmail from "../utils/nodemailer.js";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    try {
      await sendEmail({
        email: process.env.USER_EMAIL,
        subject: "your order have successfully created",
        message:
          "your order have been created successfully, please don't forget to rate our services and books, if you have any question feel free to ask on our online service center",
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
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: Error: ${err}\n${err.message}`);
});
