import Cart from "../models/cartModel.js";
import Books from "../models/booksModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

// add to cart functionality

const addToCart = catchAsync(async (req, res, next) => {
  // fetch the bookd id and quantity from the frontend
  const { bookId, quantity } = req.body;
  //   fetch user id from req.user
  const userId = req.user.id;

  // check the quantity of Books
  const book = await Books.findById(bookId);
  if (book.stock < quantity) {
    return next(
      new AppError(`Book quantity should be between 0 and ${book.stock}`, 400)
    );
  }

  //   find the card according to user
  let cart = await Cart.findOne({ user: userId });

  //   if cart does not exists
  //   added a new cart to db
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [{ book: bookId, quantity: quantity }],
      totalQuantity: quantity,
      totalPrice: book.price * quantity,
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
      let existingQty = cart.items[index].quantity;
      const newTotalQty = existingQty + quantity;

      if (newTotalQty > book.stock) {
        return next(
          new AppError(
            `Only ${book.stock - existingQty} more units available`,
            400
          )
        );
      }

      cart.items[index].quantity += quantity;

      // update total
      cart.totalQuantity += quantity;
      cart.totalPrice += book.price * quantity;
    }
    // else push book to the cart
    else {
      if (quantity > book.stock) {
        return next(
          new AppError(`Only ${book.stock} more units available`, 400)
        );
      }

      cart.items.push({ book: bookId, quantity });

      // update the total
      cart.totalQuantity += quantity;
      cart.totalPrice += book.price * quantity;
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
  //   get the book id from the book
  const { id } = req.user;
  if (!bookId) {
    return next(
      new AppError("please provide book id to remove a book from the cart", 400)
    );
  }

  //   find existing cart from the DB
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

  //   if book not found in the index
  //   return the error
  if (index === -1) {
    return next(new AppError("book not found in the cart", 404));
  }

  const removedItem = findExistingCart.items[index];
  const removedQty = removedItem.quantity;

  const findBook = await Books.findById(removedItem.book._id);
  const removedPrice = findBook.price * removedQty;

  findExistingCart.items.splice(index, 1);

  findExistingCart.totalPrice -= removedPrice;
  findExistingCart.totalQuantity -= removedQty;

  if (findExistingCart.items.length === 0) {
    findExistingCart.totalPrice = 0;
    findExistingCart.totalQuantity = 0;
  }

  //   save the cart
  await findExistingCart.save();

  //   return the response
  res.status(200).json({
    status: "success",
    message: "book was removed",
    data: findExistingCart,
  });
});

export { addToCart, removeBookFromCart };
