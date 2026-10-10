import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let hasLoggedError = false

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT) || 6379,
  // provide username or password only for redis cloud
  // by using docker you don't need to configure username or password
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,

  retryStrategy(times) {
    if(times <=3 ){
      console.log(`Redis connect attempt ${times}/3`)
      return 1000
    }

    if(!hasLoggedError){
      console.log(`Redis unavailable. stopping automatic connection`)
      hasLoggedError = true
    }

    return null

  }
});

client.on("ready", () => {
  hasLoggedError = false
  console.log("Redis is ready");
});

client.on("error", (err) => {
  if (!hasLoggedError) {
    console.error("Redis error:", err.message);
    hasLoggedError = true;
  }

});

export default client;
