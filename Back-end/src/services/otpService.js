import { redisClient } from "../config/redis.js";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
};

export const saveOTP = async (email, otp) => {
  const key = `otp:${email}`;
  await redisClient.set(key, otp, {
    EX: 300 // 5 minutes expiry
  });
};

export const getOTP = async (email) => {
  const key = `otp:${email}`;
  return await redisClient.get(key);
};

export const deleteOTP = async (email) => {
  const key = `otp:${email}`;
  await redisClient.del(key);
};