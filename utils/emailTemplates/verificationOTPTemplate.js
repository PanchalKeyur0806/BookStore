const verificationOtpTemplate = ({ name, otp, expiry }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      width: 100%;
      padding: 40px 0;
    }

    .email {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
    }

    .header {
      padding: 25px;
      text-align: center;
      background-color: #111827;
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .content {
      padding: 40px 30px;
      color: #374151;
    }

    .content h2 {
      margin-top: 0;
      color: #111827;
    }

    .otp {
      margin: 30px 0;
      padding: 18px;
      text-align: center;
      background-color: #f3f4f6;
      border-radius: 8px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #111827;
    }

    .expiry {
      color: #6b7280;
      font-size: 14px;
    }

    .footer {
      padding: 20px 30px;
      text-align: center;
      background-color: #f9fafb;
      color: #9ca3af;
      font-size: 13px;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="email">

      <div class="header">
        <h1>BookStore</h1>
      </div>

      <div class="content">

        <h2>Verify your email</h2>

        <p>
          Hello ${name || "there"},
        </p>

        <p>
          Thank you for creating an account with BookStore.
          Please use the verification code below to verify your email address.
        </p>

        <div class="otp">
          ${otp}
        </div>

        <p class="expiry">
          This OTP will expire in ${expiry}.
        </p>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>

      </div>

      <div class="footer">
        © ${new Date().getFullYear()} BookStore. All rights reserved.
      </div>

    </div>

  </div>

</body>
</html>
`;
};

export default verificationOtpTemplate;
