import { Redis } from "ioredis";
import dotenv from "dotenv";

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT) || 6379,
});

client.on("ready", () => {
  console.log("Redis is ready");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

export default client;
