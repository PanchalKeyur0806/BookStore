import Stripe from "stripe";
import dotenv from "dotenv";

import Cart from "../models/cartModel.js";
import Books from "../models/booksModel.js";
import catchAsync from "../../urlshortener/utils/catchAsync.js";
import User from "../models/userModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const loggedInUser = req.user.id;

  let user = await User.findById(loggedInUser);
  let cart = await Cart.findOne({ user: loggedInUser }).populate("items.book");

  const line_items = cart.items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.book.title,
      },
      unit_amount: item.book.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    customer_email: user.email,
    success_url: `${req.protocol}://${req.get(
      "host"
    )}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get("host")}/orders/cancel`,
  });

  res.status(200).json({
    status: "success",
    url: session.url,
    data: session,
  });
});

const success = catchAsync(async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.redirect("/");
});

const cancel = catchAsync(async (req, res, next) => {
  res.redirect("/");
});

export { createCheckoutSession, success };
