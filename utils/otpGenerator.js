import otpGenerator from "otp-generator";

function generateOtp() {
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const optExpiry = Date.now() + 30 * 1000;

  return { otp, optExpiry };
}

export default generateOtp;
