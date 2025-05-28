import Cart from "../models/cartModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// add to cart functionality

const addToCart = catchAsync(async (req, res, next) => {
  // fetch the bookd id and quantity from the frontend
  const { bookId, quantity } = req.body;
  //   fetch user id from req.user
  const userId = req.user.id;

  //   find the card according to user
  let cart = await Cart.findOne({ user: userId });

  //   if cart does not exists
  //   added a new cart to db
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [{ book: bookId, quantity: quantity }],
    });
  }

  //   if cart exists
  else {
    // find the index of book (from body)
    // and then match the to existing book in a cart
    // if index is found then return the index
    // else return -1
    const index = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    // if the book exists in cart
    // increase the quantity
    if (index > -1) {
      cart.items[index].quantity += quantity;
    }
    // else push book to the cart
    else {
      cart.items.push({ book: bookId, quantity });
    }
  }

  //   save cart to Db
  await cart.save();

  //   return the response
  res.status(200).json({
    status: "success",
    message: "added to cart",
    data: cart,
  });
});

// remove specific item from the cart
const removeBookFromCart = catchAsync(async (req, res, next) => {
  const { bookId } = req.body;
  const { id } = req.user;
  if (!bookId) {
    return next(
      new AppError("please provide book id to remove a book from the cart", 400)
    );
  }

  let findExistingCart = await Cart.findOne({ user: id });
  if (!findExistingCart) {
    return next(
      new AppError("cart not found, please create your cart first", 404)
    );
  }

  //   find the index of book that must be removed
  const index = findExistingCart.items.findIndex(
    (item) => item.book.toString() === bookId
  );
  if (index === -1) {
    return next(new AppError("book not found in the cart", 404));
  } else {
    findExistingCart.items.splice(index, 1);
  }

  await findExistingCart.save();

  res.status(200).json({
    status: "success",
    message: "book was removed",
    data: findExistingCart,
  });
});

export { addToCart, removeBookFromCart };
