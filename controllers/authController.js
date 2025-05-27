import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/userModel.js";

import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

import sendEmail from "../utils/nodemailer.js";
import generateOtp from "../utils/otpGenerator.js";
import { application } from "express";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// resiger function for authenticating the user
const register = catchAsync(async (req, res, next) => {
  const { name, email, password, dateOfBirth, phoneNumber, gender, address } =
    req.body;

  // saving user to database
  const createUser = await User.create({
    name,
    email,
    password,
    dateOfBirth,
    phoneNumber,
    gender,
    address,
  });

  // send otp to client
  const { otp, optExpiry } = generateOtp();
  createUser.emailVerifiedToken = otp;
  createUser.verificationTokenExpiry = new Date(optExpiry);

  await createUser.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: process.env.USER_EMAIL,
      subject: "Your otp",
      message: `how are you? here your otp ${otp} and your otp expiry is in 30 seconds`,
    });
  } catch (error) {
    await User.findByIdAndDelete(createUser._id);
    return next(
      new AppError("failed to send an otp, please try again later", 400)
    );
  }

  // send response to the user
  res.status(200).json({
    status: "success",
    message: "user is registered, otp is being sent to email for verification",
    data: createUser,
  });
});

// verify otp after registration
const verifyOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const { otp } = req.body;
  if (!otp) {
    return next(new AppError("please provide an otp for verification", 400));
  }

  const findUser = await User.findOne({ email });
  if (!findUser) {
    return next(new AppError("user does not exists", 404));
  }

  if (findUser.isEmailVerified) {
    return next(new AppError("user already verified", 400));
  }

  const otpIsExpiried = Date.now() > findUser.verificationTokenExpiry;
  if (otpIsExpiried) {
    return next(new AppError("otp is expired", 400));
  }

  if (findUser.emailVerifiedToken !== otp) {
    return next(new AppError("please enter correct otp", 400));
  }

  findUser.isEmailVerified = true;
  findUser.emailVerifiedToken = undefined;
  findUser.verificationTokenExpiry = undefined;

  await findUser.save({ validateBeforeSave: false });

  // generate the token
  const token = signToken(findUser._id);

  res.status(200).json({
    status: "success",
    message: "otp verified successfully",
    token,
    data: findUser,
  });
});

// resend otp
const resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("please provide your email", 400));
  }

  const findUser = await User.findOne({ email });
  if (!findUser) {
    return next(new AppError("user not found", 404));
  }

  if (findUser.isEmailVerified) {
    return next(new AppError("user already verified", 400));
  }

  // send otp to client
  const { otp, optExpiry } = generateOtp();
  findUser.emailVerifiedToken = otp;
  findUser.verificationTokenExpiry = new Date(optExpiry);

  await findUser.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: process.env.USER_EMAIL,
      subject: "Your otp",
      message: `how are you? here your otp ${otp} and your otp expiry is in 30 seconds`,
    });
  } catch (error) {
    return next(
      new AppError("failed to send an otp, please try again later", 400)
    );
  }

  res.status(200).json({
    status: "success",
    message: "otp is sent to email, please check your email",
  });
});

// login function for login the users
const login = catchAsync(async (req, res, next) => {
  // get the data from frontend
  const { email, password } = req.body;

  // check that user is exists or not
  const findUser = await User.findOne({ email });
  if (!findUser) {
    return next(new AppError("No user found ", 404));
  }

  // check the correct password
  const checkPassword = await findUser.comparePassword(
    password,
    findUser.password
  );

  if (!checkPassword) {
    return next(
      new AppError(
        "your password is incorrect, please enter correct password",
        401
      )
    );
  }

  // generate the token
  const token = signToken(findUser._id);

  // return the response
  res.status(200).json({
    status: "success",
    token,
    data: findUser,
  });
});

// forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("please provide email address", 400));
  }

  const findUser = await User.findOne({ email });
  if (!findUser) {
    return next(new AppError("user not found", 400));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  findUser.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  findUser.passwordExpires = Date.now() + 30 * 1000;

  await findUser.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetPassword/${resetToken}`;
  const message = `forget your password? please click this link to change your password ${url}`;

  try {
    await sendEmail({
      email: process.env.USER_EMAIL,
      subject: "Forgot your password",
      message: message,
    });
  } catch (error) {
    return next(
      new AppError(
        "Error occured while sending email, please try again later",
        400
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "email send successfully",
  });
});

// reset password
const resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next(new AppError("please provide your password", 400));
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const findUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordExpires: { $gt: Date.now() },
  });

  if (!findUser) {
    return next(new AppError("user not found", 400));
  }

  findUser.password = password;
  findUser.passwordResetToken = undefined;
  findUser.passwordExpires = undefined;

  await findUser.save();

  res.status(200).json({
    status: "success",
    message: "password chagned successfully",
  });
});

// protect route
const protect = catchAsync(async (req, res, next) => {
  let token;

  // check that token is exists or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // get the token
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new AppError("Please login to access this page", 400));
    }

    // verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // find the user
    const findUser = await User.findById(decode.id);
    if (!findUser) {
      return next(new AppError("user not found, please register first", 404));
    }

    // check that user is verified or not
    const verifiedUser = findUser.isEmailVerified;
    if (!verifiedUser) {
      return next(
        new AppError(
          "you are not verified, please verified first then try again",
          403
        )
      );
    }

    req.user = decode;
  } else {
    return next(new AppError("Token not found please register first", 400));
  }

  next();
});

export {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  protect,
};
