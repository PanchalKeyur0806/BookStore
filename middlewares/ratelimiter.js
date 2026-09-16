import { increaseMaxListeners } from "bullmq";
import rateLimit from "express-rate-limit";

export const createRateLimiter = (time, max) => {
  return rateLimit({
    windowMs: time,
    max: max,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
      success: false,
      message: "Too many requests. Please try again later",
    },
  });
};

export const generalRateLimiter = createRateLimiter(60000, 15);
export const getRateLimiter = createRateLimiter(60000, 30);
export const mutationLimiter = createRateLimiter(60000, 10);
export const authRateLimiter = createRateLimiter(60000, 5);
