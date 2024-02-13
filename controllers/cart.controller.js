const Product = require("../models/product.model");

function getCart(req, res) {
  res.render("customer/cart/cart");
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId); //-- We sent POST req for adding items in cart -- Since req body attached to POST req
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;

  cart.addItem(product); //How to get product in this cart controller action -- Form database
  // Update cart saved back into the session
  req.session.cart = cart; // res.locals.cart; // Cart in session is stored in session db collection

  // We don't redirect -- We'll use AJAX req
  res.status(201).json({
    message: "Cart Updated!",
    newTotalItems: cart.totalQuantity, //Name is upto us
  }); // -201(success code)
}

function updateCartItem(req, res) {
  const cart = res.locals.cart; //To get access of cart as before

  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity // Forcing conversion to number
  );

  req.session.cart = cart;

  res.json({
    message: "Item Updated!",
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
