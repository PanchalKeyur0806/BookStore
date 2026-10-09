import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT) || 6379,
  // provide username or password only for redis cloud
  // by using docker you don't need to configure username or password
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD
});

client.on("ready", () => {
  console.log("Redis is ready");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

export default client;
