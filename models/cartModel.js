import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true,
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
        min: [1, "Quantity must be at least 1"],
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
  },
  isOrdered: {
    type: Boolean,
    default: false,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
