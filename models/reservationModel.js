import mongoose, { mongo } from "mongoose";

const reservationModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  items: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalQty: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});

reservationModel.index({ user: 1 });
reservationModel.index({ expiresAt: 1 });

const Reservation = mongoose.model("Reservation", reservationModel);

export default Reservation;
