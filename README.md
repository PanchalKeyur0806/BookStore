# 📚 BookStore API – Node.js Backend

A full-featured eCommerce-style backend built with **Node.js**, **Express**, and **MongoDB**, designed using the **MVC architecture**. It includes authentication, payments, order management, analytics, Redis caching, and more — ideal for developers building scalable eCommerce apps or learning production-grade backend patterns.

---

## 🚀 Features

✅ User & Admin Authentication (JWT)  
✅ OTP Email Verification via Nodemailer  
✅ CRUD operations for Books  
✅ Book Reviews by Users  
✅ Advanced Filtering, Searching, Sorting, Pagination  
✅ Stripe Payment Gateway Integration  
✅ Payment Cancelation Support  
✅ Invoice Generator on Successful Orders (PDF)  
✅ Admin Dashboard with:

- 📈 Sales Analytics
- 📦 Inventory Management

✅ Redis Caching for Performance  
✅ BullMQ Queue System for Order Processing  
✅ Role-Based Access Control  
✅ MVC Folder Structure  
✅ Secure Environment Config & Error Handling

---

## 📁 Folder Structure

BookStore/
├── controllers/<br>
├── routes/<br>
├── models/<br>
├── middlewares/<br>
├── utils/<br>
├── config/<br>
├── queues/<br>
├── workers/<br>
├── services/<br>
├── .env<br>
├── server.js<br>
└── README.md

## How to install & setup the project

#### clone our repository

    git clone https://github.com/PanchalKeyur0806/BookStore.git
    cd BookStore
    npm install

#### Edit environment variables

    in BookStore folder create .env file and add following property

    PORT=your port number
    DB_STRING=your db string

    JWT_SECRET_KEY=your jwt secret key
    JWT_EXPIRES=your jwt expiry key

    USER_EMAIL=your email
    GMAIL_APP_PASSWORD=your passowrd

    STRIPE_SECRET_KEY=your stripe secret key from stripe website
    STRIPE_WEBHOOK=your stripe webhook key

**Note :- in order to get gmail app passoword you need to do following things**

1. go to google account settings
2. search for App Passwords and click on it
3. and create your app name
4. after clicking you will see something like this :- **fkak djir ubyo hyxz**
5. paste this text in **GMAIL_APP_PASSWORD** field

**How to setup Redis**

1. install docker on your computer
2. check that docker is properly installed or not
3. then run this command to install redis <br>
   docker run -d --name redis -p 6379:6379 redis<br>
   **Note:- make sure that docker is running on background**

#### How to run the project

1. in base dir run this command <br>
   npm run dev
2. run two workers in another terminal,
   go to workers folder and
   run these two command in the terminal <br>
   cd workers<br>
   node emailWorker.js<br>
   node orderWorker.js

## NOTE :- If you have any error message while setups the project, feel free to contact me on gmail

## And also this is development project not an production level project

gmail id :- panchalkeyur694@gmail.com
