import { Queue } from "bullmq";
import client from "../config/redisClient.js";

const orderQueue = new Queue("order-processing", {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
});

export { orderQueue };
