# 📚 BookStore API – Node.js Backend

A production-grade, eCommerce-style backend built with **Node.js**, **Express**, and **MongoDB**, designed using the **MVC architecture**. It features authentication, payments, order processing, analytics, caching, and more — ideal for developers building scalable, real-world applications.

---

## 📄 API Documentation

📎 [View Postman Documentation](https://documenter.getpostman.com/view/40726492/2sB34hFf8z)

---

## 🚀 Features

### 🔐 Authentication & Security

- ✅ JWT-based User & Admin Authentication
- ✅ Email OTP Verification via Nodemailer
- ✅ Role-Based Access Control (RBAC)
- ✅ Secure User Deactivation
- ✅ API Rate Limiting
- ✅ Secure Environment-based Configuration
- ✅ Centralized Error Handling

### 📚 Book Management

- ✅ Complete CRUD Operations for Books
- ✅ Book Review & Rating System
- ✅ Wishlist Management
- ✅ Advanced Filtering, Search, Sorting & Pagination

### 🛒 Cart & Orders

- ✅ Shopping Cart Management
- ✅ Complete Order Management
- ✅ Order Cancellation Support
- ✅ BullMQ Queue System for Background Order Processing

### 💳 Payments & Invoices

- ✅ Stripe Payment Integration
- ✅ Payment Status Tracking
- ✅ Automated PDF Invoice Generation

### 📊 Admin Dashboard & Analytics

- ✅ Admin Dashboard with Key Business Metrics
- ✅ Sales & Revenue Analytics
- ✅ Daily, Monthly & Yearly Sales Analytics
- ✅ Order Analytics
- ✅ Order Growth Analytics
- ✅ Average Order Value (AOV) Analytics
- ✅ Book Performance Analytics
- ✅ Book Sales & Revenue Analytics
- ✅ Inventory & Stock Analytics
- ✅ Dead Stock & Slow-Moving Stock Detection
- ✅ Category-wise Sales & Revenue Analytics
- ✅ Category Sales Trend Analysis
- ✅ Book Rating Distribution
- ✅ Customer Analytics
- ✅ Payment Analytics
- ✅ Top-Performing Books Analytics

### ⚡ Performance & Background Processing

- ✅ Redis Caching for High Performance
- ✅ BullMQ Queue System for Asynchronous Jobs
- ✅ Background Email Processing

### 🏗️ Architecture & Code Quality

- ✅ Clean MVC Project Structure
- ✅ Modular & Maintainable Codebase
- ✅ Centralized Error Handling
- ✅ Secure Configuration Management

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

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Email:** Nodemailer + Gmail SMTP
- **Payments:** Stripe
- **Image Storage:** Cloudinary
- **Caching:** Redis
- **Background Jobs:** BullMQ
- **API Documentation:** Postman
- **Architecture:** MVC

## 📋 Requirements

Before running the project, make sure you have:

- Node.js 22+
- MongoDB
- Docker
- Redis
- Stripe account
- Cloudinary account
- Gmail account with App Password

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

NODE_ENV=production/development

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

---

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Search for **App Passwords** and open the section
3. Generate a new app password
4. Copy and paste the password into the `.env` under `GMAIL_APP_PASSWORD`

## 🧱 Redis Setup (using Docker)

1. Install Docker on your machine
2. Make sure Docker is running in the background
3. Run this command if Redis is not installed:

```bash
docker run -d --name redis -p 6379:6379 redis
```

4. Start Redis if already installed <br>
   If you have already created the Redis container and it is stopped, run:

```bash
docker start redis
```

5. To stop Redis:

```bash
docker stop redis
```

6. You can check whether Redis is running with:

```bash
docker ps
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

## 💳 Stripe Setup

1. Create a Stripe account.
2. Enable **Test Mode** for development.
3. Go Settings > Developers > Manage Api Keys > Secret Key.
4. Add it to `.env`:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
```

🔗 Configure Stripe Webhooks
To receive Stripe webhook events during local development, you need to use the Stripe CLI.

Note: Make sure the Stripe CLI is installed before continuing.

If you haven't logged in to the Stripe CLI yet, run:

```bash
stripe login
```

Then start webhook forwarding:

```bash
stripe listen --forward-to localhost:8002/webhook
```

The CLI will display a webhook signing secret starting with whsec\_ <br>
Copy that secret and add it to your .env file:

```env
STRIPE_WEBHOOK=your_stripe_webhook_secret
```

---

## ▶️ Running the Project

NOTE :- If you are testing payment processing, you must also run

```env
stripe listen --forward-to localhost:8002/webhook
```

Without this, Stripe webhook events will not be forwarded to your local application

### Development Server

```bash
npm run dev
```

---

## 🔮 Future Improvements

- 🔍 Improve and optimize pagination, search, and sorting functionality for better performance and scalability.
- ⚙️ Improve the background worker architecture so workers can be managed automatically with the main application, eliminating the need to start a separate worker process manually during local development.

📧 **Contact:** panchalkeyur694@gmail.com
