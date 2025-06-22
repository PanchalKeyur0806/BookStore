import { Queue } from "bullmq";

const emailQueue = new Queue("email-queue", {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
});

export { emailQueue };
