// MW job to look incoming request and determinig whether its coming from user who already has a cart or doesn't have one
const Cart = require("../models/cart.model");

function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    const sessionCart = req.session.cart;
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    ); // We redefine it using Cart() bcoz way data stored in session s.t. any methods attached to object are not stored there therfore we re-initialize it
  }

  // Now making available for this response cycle in other MW and views
  res.locals.cart = cart;

  next();
}

module.exports = initializeCart;
