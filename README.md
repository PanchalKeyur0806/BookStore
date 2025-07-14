# 📚 BookStore API – Node.js Backend

A production-grade, eCommerce-style backend built with **Node.js**, **Express**, and **MongoDB**, designed using the **MVC architecture**. It features authentication, payments, order processing, analytics, caching, and more — ideal for developers building scalable, real-world applications.

---

## 📄 API Documentation

📎 [View Postman Documentation](https://documenter.getpostman.com/view/40726492/2sB34hFf8z)

---

## 🚀 Features

- ✅ JWT-based User & Admin Authentication
- ✅ Email OTP Verification via Nodemailer
- ✅ Full CRUD for Books
- ✅ Book Review System
- ✅ Advanced Filtering, Search, Sorting, and Pagination
- ✅ Stripe Payment Integration with Cancellation Support
- ✅ Auto-generated PDF Invoices
- ✅ Admin Dashboard with:
  - 📈 Sales Analytics
  - 📦 Inventory Management
- ✅ Redis Caching for High Performance
- ✅ BullMQ Queue System for Order Processing
- ✅ Role-Based Access Control (RBAC)
- ✅ Clean MVC Project Structure
- ✅ Secure Config Management & Error Handling

---

## 📁 Project Structure

```
BookStore/
├── controllers/
├── routes/
├── models/
├── middlewares/
├── utils/
├── config/
├── queues/
├── workers/
├── services/
├── .env
├── server.js
└── README.md
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/PanchalKeyur0806/BookStore.git
cd BookStore
npm install
```

### 2️⃣ Setup Environment Variables

Create a `.env` file in the root folder and add the following:

```env
PORT=5000
DB_STRING=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=your_jwt_expiry_time

USER_EMAIL=your_email
GMAIL_APP_PASSWORD=your_gmail_app_password

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK=your_stripe_webhook_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 🔑 Getting a Gmail App Password

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Search for **App Passwords** and open the section
3. Generate a new app password
4. Copy and paste the password into the `.env` under `GMAIL_APP_PASSWORD`

---

## 🧱 Redis Setup (using Docker)

1. Install Docker on your machine
2. Make sure Docker is running in the background
3. Run Redis using:

```bash
docker run -d --name redis -p 6379:6379 redis
```

---

## ☁️ Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your dashboard and copy:
   - Cloud Name → `CLOUDINARY_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`
3. Paste them into your `.env` file

---

## ▶️ Running the Project

### Development Server

```bash
npm run dev
```

### Run Workers for Queued Jobs

Open a separate terminal:

```bash
cd workers
node emailWorker.js
node orderWorker.js
```

---

## ⚠️ Notes

- This project is in **active development** and is not intended for production use.
- For any issues or errors during setup, feel free to reach out via email.

📧 **Contact:** panchalkeyur694@gmail.com
