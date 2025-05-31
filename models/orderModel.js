import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        book: {
          type: mongoose.Schema.ObjectId,
          ref: "Books",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    totalQuantity: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: Number, required: true },
    },

    orderStatus: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentInfo: {
      stripePaymentId: { type: String },
      stripeClientSecret: { type: String },
      paymentMethod: { type: String, enum: ["card"], default: "card" },
      status: {
        type: String,
        enum: ["unpaid", "paid", "failed"],
        default: "unpaid",
      },
      paidAt: { type: Date, default: Date.now },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
