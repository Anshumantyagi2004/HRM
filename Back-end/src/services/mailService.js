import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"HRMS" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Login OTP",
    html: `
      <div style="font-family:Arial">
        <h2>Login OTP</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:5px;">${otp}</h1>
        <p>Valid for 5 minutes</p>
      </div>
    `,
  });
};