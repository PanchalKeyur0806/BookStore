import mongoose, { mongo } from "mongoose";

const reservationModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  books: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Books",
      required: [true, "Book is required"],
    },
  ],
  totalQty: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 20,
  },
});

const Reservation = mongoose.model("Reservation", reservationModel);

export default Reservation;
