const orderCreatedTemplate = ({
  name,
  orderId,
  totalQuantity,
  totalPrice,
  shippingAddress,
}) => {
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

    .success {
      margin: 25px 0;
      padding: 18px;
      text-align: center;
      background-color: #f0fdf4;
      border-radius: 8px;
      color: #166534;
      font-weight: bold;
    }

    .order-details {
      margin: 25px 0;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
    }

    .order-details p {
      margin: 8px 0;
    }

    .label {
      font-weight: bold;
      color: #111827;
    }

    .address {
      margin-top: 20px;
      padding: 15px;
      border-left: 3px solid #111827;
      background-color: #f9fafb;
    }

    .message {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.6;
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

        <h2>Order Created Successfully 🎉</h2>

        <p>
          Hello ${name || "there"},
        </p>

        <p>
          Thank you for your order. Your order has been successfully created
          and your payment has been received.
        </p>

        <div class="success">
          Your order has been successfully placed.
        </div>

        <div class="order-details">

          <p>
            <span class="label">Order ID:</span>
            ${orderId}
          </p>

          <p>
            <span class="label">Total Items:</span>
            ${totalQuantity}
          </p>

          <p>
            <span class="label">Total Amount:</span>
            ₹${totalPrice}
          </p>

        </div>

        <p class="label">
          Shipping Address
        </p>

        <div class="address">
          ${shippingAddress?.name || ""}<br />
          ${shippingAddress?.address || ""}<br />
          ${shippingAddress?.city || ""}, 
          ${shippingAddress?.state || ""}<br />
          ${shippingAddress?.postalCode || ""}
        </div>

        <p class="message">
          We will notify you when your order is shipped.
          If you have any questions regarding your order,
          please contact our customer support team.
        </p>

        <p class="message">
          After receiving your books, don't forget to leave a review
          and rate your experience with BookStore.
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

export default orderCreatedTemplate;
