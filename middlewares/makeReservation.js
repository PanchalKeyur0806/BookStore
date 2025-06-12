import Books from "../models/booksModel.js";
import Cart from "../models/cartModel.js";
import Reservation from "../models/reservationModel.js";
import User from "../models/userModel.js";

import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const makeReservation = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  const cart = await Cart.findOne({ user: id });

  if (!user) return next(new AppError("User not found", 404));
  if (!cart) return next(new AppError("Cart not found", 404));

  const existingReservation = await Reservation.findOne({ user: user._id });
  if (existingReservation) {
    await Reservation.findByIdAndDelete(existingReservation._id);

    console.log("Reservation deleted");
  }

  //   get the book ids
  const bookIds = cart.items.map((item) => item.book);

  //   check the all books quantity in the carts
  for (const item of cart.items) {
    const book = await Books.findById(item.book);
    if (!book) {
      return next(new AppError(`No Book found with this ${item.book} id`, 404));
    }

    // check the book quantity with cart's book quantity
    if (book.stock < item.quantity) {
      return next(
        new AppError(
          `We have only ${book.stock >= 0 ? book.stock : 0} of ${
            book.title
          } left`,
          400
        )
      );
    }
  }

  //   make a reservation
  const reservation = await Reservation.create({
    user: id,
    books: bookIds,
    totalQty: cart.totalQuantity,
  });

  if (!reservation) {
    return next(new AppError("Reservation is not created yet", 400));
  }

  next();
});

export default makeReservation;
