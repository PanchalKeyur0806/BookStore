const forgotPasswordTemplate = ({ name, resetUrl }) => {
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
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
    }

    .header {
      padding: 25px;
      text-align: center;
      background: #111827;
      color: white;
    }

    .content {
      padding: 40px 30px;
      color: #374151;
    }

    .button {
      display: inline-block;
      margin: 25px 0;
      padding: 14px 24px;
      background: #111827;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
    }

    .warning {
      color: #6b7280;
      font-size: 14px;
    }

    .footer {
      padding: 20px;
      text-align: center;
      background: #f9fafb;
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

        <h2>Reset your password</h2>

        <p>
          Hello ${name || "there"},
        </p>

        <p>
          We received a request to reset the password associated with
          your BookStore account.
        </p>

        <a href="${resetUrl}" class="button">
          Reset Password
        </a>

        <p class="warning">
          This password reset link will expire in 30 seconds.
        </p>

        <p>
          If you didn't request a password reset, you can safely ignore
          this email.
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

export default forgotPasswordTemplate;
