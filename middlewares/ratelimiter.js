import { increaseMaxListeners } from "bullmq";
import rateLimit from "express-rate-limit";

const createRateLimiter = (time, max, message) => {
  return rateLimit({
    windowMs: time,
    max: max,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
      success: false,
      message: message ? message : "Too many requests. Please try again later",
    },
  });
};

export default createRateLimiter;
