# 📚 BookStore API – Node.js Backend

A production-grade, eCommerce-style backend built with **Node.js**, **Express**, and **MongoDB**, designed using the **MVC architecture**. It features authentication, payments, order processing, analytics, caching, and more — ideal for developers building scalable, real-world applications.

---

## 📄 API Documentation

- 🌐 **Interactive Redoc API Documentation:** Served locally at `http://localhost:5000/` (built with OpenAPI 3.1 & Redoc)
- 📎 **Postman API Documentation:** [View Postman Documentation](https://documenter.getpostman.com/view/40726492/2sB34hFf8z)
- 📜 **OpenAPI Specifications:** Multi-file OpenAPI 3.1 definitions located in `/docs` (`openapi.yaml`, `admin.yaml`, `auth.yaml`, `book.yaml`, `cart.yaml`, `order.yaml`, `review.yaml`, `user.yaml`, `wishlist.yaml`, `schema.yaml`)

---

## 🚀 Features

### 🔐 Authentication & Security

- ✅ JWT-based User & Admin Authentication
- ✅ Email OTP Verification via Nodemailer
- ✅ Role-Based Access Control (RBAC) with Self-Protection Guards
- ✅ Account Activation & Suspension Management (`/admin/activateUser`, `/admin/deactivateUser`)
- ✅ Role Modification & Promotion/Demotion (`/admin/change-role`)
- ✅ Multi-tier API Rate Limiting (Read, Mutation, Auth, General)
- ✅ Input & Parameter Validation (`validateUser`, `validateId`)
- ✅ Secure Environment-based Configuration
- ✅ Centralized Error Handling & Operational Exceptions

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
CORS_ORIGIN=*


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

## 📡 API Endpoints Reference

All endpoints except public catalog browsing and authentication require a valid Bearer JWT token in the `Authorization` header (`Bearer <token>`).

### 🛡️ Admin Endpoints (`/admin`)
*Requires `role: 'admin'`. Base rate limiter: 30 req/min (`getRateLimiter`). Mutation endpoints additionally enforce 10 req/min (`mutationLimiter`).*

| Method | Endpoint | Description | Key Middlewares & Validations |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | Aggregated dashboard statistics (revenue, orders, low stock, users) | `protect`, `restrictTo('admin')` |
| `GET` | `/admin/getSalesAnalytics` | Revenue & sales trends grouped by day, week, or month | `startDate`, `endDate`, `groupBy` |
| `GET` | `/admin/book/analytics` | Catalog health (active, inactive, low-stock, best/low selling) | Aggregated across Books & Orders |
| `GET` | `/admin/book/deadstock` | Books with zero sales in the last 30 days (paginated) | `page`, `limit` |
| `GET` | `/admin/book/performance` | Detailed book sales, copies sold, and revenue performance | `page`, `limit` |
| `GET` | `/admin/book/category/revenue` | Sales count and revenue distribution across all book categories | Aggregated across all paid orders |
| `GET` | `/admin/book/category/trend` | Monthly category sales trends over a specified date range | `startDate`, `endDate` (max 1 year) |
| `GET` | `/admin/book/rating/distribution` | Review star rating counts (1 to 5 stars) per book | `page`, `limit` |
| `GET` | `/admin/order/analytics` | Total counts per order status and platform cancellation rate | Aggregated across Orders |
| `GET` | `/admin/order/order-growth` | Day-by-day order counts with automated date densification | `startDate`, `endDate` (max 90 days) |
| `GET` | `/admin/order/avg-order-value` | Monthly Average Order Value (AOV) and revenue trend | `startDate`, `endDate` (max 1 year) |
| `GET` | `/admin/customer/analytics` | Customer growth, top spenders, and returning customer rate | `startDate`, `endDate` (max 1 year) |
| `GET` | `/admin/payment/analytics` | Payment volume, amounts, and success/failure rates | Aggregated by Stripe payment status |
| `PATCH` | `/admin/activateUser/:userId` | Reactivate a suspended user account (`isActive: true`) | `mutationLimiter`, `validateId('userId')` |
| `PATCH` | `/admin/deactivateUser/:userId` | Suspend a user account (`isActive: false`). Guards against self-deactivation & admin suspension. | `mutationLimiter`, `validateId('userId')`, self & admin guard |
| `PATCH` | `/admin/change-role/:userId` | Update a user's role (`admin` or `user`). Guards against self-role changes. | `mutationLimiter`, `validateId('userId')`, role enum validation |

---

### 👤 User Endpoints (`/users`)
*Requires authenticated session (`protect`).*

| Method | Endpoint | Description | Key Middlewares & Validations |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Retrieve profile of the currently logged-in user | `getRateLimiter` (30 req/min) |
| `PATCH` | `/users/updateMe` | Update profile information and shipping address | `mutationLimiter` (10 req/min), `validateUser` (validates strings, dates, phone numbers, gender enums, address fields) |
| `GET` | `/users/orders` | Retrieve authenticated user's order history | `getRateLimiter` |
| `POST` | `/users/favBooks` | Add a book to user's favorites collection | `mutationLimiter`, book existence check |
| `GET` | `/users/all` | Admin query: List all users with regex filters and sorting | `getRateLimiter`, `restrictTo('admin')`, `email`, `phone`, `name`, `sort`, `page`, `limit` |
| `GET` | `/users/:userId` | Admin query: Retrieve a user by ObjectId | `getRateLimiter`, `validateId('userId')`, `restrictTo('admin')` |

---

### 📚 Book Endpoints (`/books`)

| Method | Endpoint | Access | Description | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/books` | Public | List active books with regex search, sorting, and pagination | Regex on `title` and `author`, sorting (`new`, `old`), pagination |
| `POST` | `/books` | Admin | Create a new book with Cloudinary cover image | `mutationLimiter`, Multer file upload, `validateBooks` |
| `GET` | `/books/:bookId` | Public | Fetch book details by ID | Redis cache-aside lookup (`book:{bookId}`) |
| `PATCH` | `/books/:bookId` | Admin | Update book metadata or replace cover image | `mutationLimiter`, `validateId('bookId')`, cache invalidation |
| `DELETE` | `/books/:bookId` | Admin | Soft-delete a book (`isDeleted: true`) | Preserves historical orders; returns HTTP 204 |

---

### ⭐ Review Endpoints (`/reviews` & `/books/:bookId/review`)

| Method | Endpoint | Access | Description | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/books/:bookId/review` | Authenticated | Get paginated reviews for a specific book | Regex query `msg`, sorting, auto-populated author |
| `POST` | `/books/:bookId/review` | Customer (`user`) | Create a review and rating (1–5 stars) | Auto-recalculates book rating average & quantity |
| `PATCH` | `/books/:bookId/review` | Customer (`user`) | Update review commentary or rating | Verifies book existence; synchronizes rating aggregate |
| `DELETE` | `/books/:bookId/review` | Customer (`user`) | Delete review and star rating | Resynchronizes book score; returns HTTP 204 |
| `GET` | `/reviews/all` | Admin | Platform-wide review monitoring | Filter by review text regex, sorting, pagination |
| `GET` | `/reviews/:bookId/me` | Customer (`user`) | Retrieve logged-in user's review for a book | Redis cached (`user:{id}:book:{bookId}`) |

---

### 💳 Order & Payment Endpoints (`/orders` & `/webhook`)

| Method | Endpoint | Access | Description | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/orders/createcheckoutsession` | Customer (`user`) | Create a Stripe checkout session from cart | `makeReservation` inventory reservation; BullMQ async order generation |
| `GET` | `/orders/refundPayment/:stripePaymentId` | Customer (`user`) | Request refund for a paid order | `checkRefundStatus`: Enforces 7-day (168-hour) refund window and `paid` status |
| `GET` | `/orders/all` | Admin | Platform-wide order list with sorting | `page`, `limit`, `sort` |
| `GET` | `/orders/order/:orderId` | Customer / Admin | Fetch order details by ID | Redis cache (`order:{orderId}`); strictly validates user ownership |
| `GET` | `/orders/success` | Public | Stripe redirect callback handler | Redirects to home page |
| `POST` | `/webhook` | Stripe | Raw JSON Stripe webhook listener | Handles session completed, expired, refund confirmation, inventory restock |

---

## ⚠️ Error Handling & Response Architecture

The application implements a centralized error handling system (`controllers/errorController.js`) distinguishing between operational errors and unexpected programmer errors.

### Standard Response Schemas

#### Successful Response:
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Error Response:
```json
{
  "status": "Error",
  "message": "Specific error explanation"
}
```

### HTTP Status Codes:
- `400 Bad Request`: Validation failure (`validateUser`, `validateId`), business rule breach (self-deactivation, role constraints, 7-day refund window expiration, inventory shortage).
- `401 Unauthorized`: Missing Bearer token, expired JWT, or invalid signature.
- `403 Forbidden`: Role permission failure (e.g. non-admin accessing admin routes) or unverified email account.
- `404 Not Found`: Entity not found in database or ownership mismatch.
- `429 Too Many Requests`: Client exceeded rate limiting thresholds.
- `500 Internal Server Error`: Unexpected non-operational error.

---

## 🔮 Future Improvements

- 🔍 Improve and optimize pagination, search, and sorting functionality for better performance and scalability.
- ⚙️ Improve the background worker architecture so workers can be managed automatically with the main application, eliminating the need to start a separate worker process manually during local development.

📧 **Contact:** panchalkeyur694@gmail.com
