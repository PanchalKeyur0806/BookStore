import nodemailer from "nodemailer";
import AppError from "./AppError.js";
import generateOtp from "./otpGenerator.js";

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 465,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailoptions = {
    form: process.env.USER_EMAIL,
    to: options.email || process.env.USER_EMAIL,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailoptions, (error, info) => {
    if (error) console.log("error occured ", error);
    else console.log("email sent successfully");
  });
};

export default sendEmail;
