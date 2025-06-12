import Stripe from "stripe";
import dotenv from "dotenv";

import Cart from "../models/cartModel.js";
import Books from "../models/booksModel.js";
import User from "../models/userModel.js";
import Reservation from "../models/reservationModel.js";
import Order from "../models/orderModel.js";

import catchAsync from "../../urlshortener/utils/catchAsync.js";
import AppError from "../utils/AppError.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// check out session
const createCheckoutSession = catchAsync(async (req, res, next) => {
  const loggedInUser = req.user.id;

  let user = await User.findById(loggedInUser);
  let cart = await Cart.findOne({ user: loggedInUser }).populate("items.book");

  if (!user) return next(new AppError("User not found", 404));
  if (!cart) return next(new AppError("cart not found", 404));

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

  // create a session
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

  // return the response
  res.status(200).json({
    status: "success",
    url: session.url,
    data: session,
  });
});

// success controller
const success = catchAsync(async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.redirect("/");
});

// cancel controller
const cancel = catchAsync(async (req, res, next) => {
  res.redirect("/");
});

// refund the payment
const refundPaymnet = catchAsync(async (req, res, next) => {
  const { stripePaymentId } = req.params;

  const createRefund = await stripe.refunds.create({
    payment_intent: stripePaymentId,
    reason: "requested_by_customer",
  });
  if (!createRefund) {
    return next(
      new AppError("failed to create refund, please try again later", 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: "payment refund successfull",
    data: createRefund,
  });
});

// send invoices
const createAndSendInvoices = catchAsync(async (req, res, next) => {
  const customer = await stripe.customers.create({
    email: "panchalkeyur694@gmail.com",
    name: "Who am i?",
  });

  await stripe.invoiceItems.create({
    customer: customer.id,
    amount: "500",
    currency: "inr",
    description: "Purchase a book",
  });

  const invoice = await stripe.invoices.create({
    customer: customer.id,
    auto_advance: true,
  });

  await stripe.invoices.finalizeInvoice(invoice.id);

  res.status(200).json({
    status: "success",
    message: "email sent successfully",
  });
});

// stripe webhook
const webhook = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK
    );
  } catch (error) {
    console.log(`WEB HOOK error ${error}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      try {
        const session = event.data.object;

        const user = await User.findOne({ email: session.customer_email });
        const cart = await Cart.findOne({ user: user._id });
        const reservation = await Reservation.findOne({ user: user._id });

        if (session.payment_status === "paid") {
          // save to order Db
          const order = await Order.create({
            user: user._id,
            items: cart.items,
            totalQuantity: cart.totalQuantity,
            totalPrice: cart.totalPrice,
            shippingAddress: {
              name: user.name,
              email: session.customer_email,
              phoneNumber: user.phoneNumber,
              street: user.address.line,
              city: user.address.city,
              state: user.address.state,
              zipCode: user.address.zipCode,
            },
            orderStatus: "paid",
            paymentInfo: {
              stripePaymentId: session.payment_intent,
              paymentMethod: "card",
              status: "paid",
            },
          });

          // update the book sales
          const bulkOps = [];
          for (const item of cart.items) {
            const findBook = await Books.findById(item.book);
            const slaesAmount = findBook.price * item.quantity;

            bulkOps.push({
              updateOne: {
                filter: { _id: item.book },
                update: {
                  $inc: { totalSales: slaesAmount, stock: -item.quantity },
                },
              },
            });
          }

          // upload bulk of data using bulkWrite
          if (bulkOps.length > 0) {
            await Books.bulkWrite(bulkOps);
            console.log("update the all book total sales");
          }

          // delete the cart and reservation
          await Cart.findByIdAndDelete(cart._id);

          if (reservation) {
            await Reservation.findByIdAndDelete(reservation._id);
          }
        }
      } catch (error) {
        console.log("error ", error.message);
        console.log("Stack trace ", error.stack);

        return res.status(200).json({
          status: "success",
          message: "error occured",
        });
      }
      break;

    case "checkout.session.expired":
      try {
        const session = event.data.object;
        const customerEmail = session.customer_email;

        if (customerEmail) {
          const user = await User.findOne({ email: customerEmail });
          if (user) {
            const reservation = await Reservation.findOne({ user: user._id });

            if (reservation) {
              const cart = await Cart.findOne({ user: user._id });
              if (cart) {
                console.log(
                  "Session is expired - reservation will be cleaned up"
                );
              }
            }

            await Reservation.findByIdAndDelete(reservation._id);
            console.log("Reservation cleaned up for expired session ");
          }
        }
      } catch (error) {
        console.log("Error : - ", error);
      }
      break;

    case "payment_intent.canceled":
      try {
        const paymentIntent = event.data.object;
        let user = null;

        if (paymentIntent.customer) {
          const customer = await stripe.customers.retrieve(
            paymentIntent.customer
          );

          user = await User.findOne({ user: user.email });
        } else if (paymentIntent.receipt_email) {
          user = await User.findOne({ email: paymentIntent.receipt_email });
        }

        if (user) {
          const reservation = await Reservation.findOne({ user: user._id });

          if (reservation) {
            await Reservation.findByIdAndDelete(reservation._id);
            console.log(
              "Reservation cleaned up for canceled payment:",
              reservation._id
            );
          }
        }
        if (customerEmail) {
          const user = await User.findOne({ email: customerEmail });
          if (user) {
            const reservation = await Reservation.findOne({ user: user._id });

            if (reservation) {
              await Reservation.findOneAndDelete(reservation._id);
              console.log("Reservation deleted");
            }
          }
        }
      } catch (error) {
        console.log("Error : ", error);
      }
      break;

    case "charge.refunded":
      const charge = event.data.object;
      const paymentId = charge.payment_intent;

      // find the order
      const order = await Order.findOne({
        "paymentInfo.stripePaymentId": paymentId,
      });

      if (order) {
        order.orderStatus = "cancelled";
        order.paymentInfo.stripePaymentId = "cancelled";

        await order.save();
        console.log("order have been saved ", order._id);
      }

      // find books
      const bulkOps = [];
      for (const item of order.items) {
        const findBook = await Books.findById(item.book);

        const bookQty = item.quantity;
        const salesAmount = order.totalPrice;

        findBook.stock += bookQty;
        findBook.totalSales -= salesAmount;

        bulkOps.push({
          updateOne: {
            filter: { _id: item.book },
            update: {
              $inc: { totalSales: -salesAmount, stock: bookQty },
            },
          },
        });
      }

      if (bulkOps.length > 0) {
        await Books.bulkWrite(bulkOps);
        console.log("book is refunded");
      }
      break;

    case "refund.failed":
      const refund = event.data.object;
      console.log("refund have been failed ", refund);

      break;

    default:
      break;
  }

  res.status(200).json({
    status: "success",
    message: "payment is successfull",
  });
});
export {
  createCheckoutSession,
  success,
  webhook,
  refundPaymnet,
  createAndSendInvoices,
};
