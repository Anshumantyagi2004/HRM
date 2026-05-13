import { createClient } from "redis";

let redisClient = null;

export const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      console.log("⚠️ Redis disabled (REDIS_URL missing)");
      return;
    }

    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redisClient.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

export { redisClient };