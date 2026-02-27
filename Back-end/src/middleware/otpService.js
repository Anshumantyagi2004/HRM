import bcrypt from 'bcryptjs';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
};

export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

export const verifyOTP = async (otp, hash) => {
  return await bcrypt.compare(otp, hash);
};