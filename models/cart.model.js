const Product = require('./product.model');

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    // Also giving default value
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  async updatePrices() {
    const productIds = this.items.map(function (item) {
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deletableCartItemProductIds = [];

    for (const cartItem of this.items) {
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      }); // find() get executed for all products in array and prod is value provided by JS automatically

      if (!product) {
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product) {
    //--Storing Cart data in session -- Bcoz session is automatically tied to every vistor
    // Pushing is only correct if product is not a part
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      // Assumes that each item has product(object) property -- we'll implement later
      // (LHS) Cart item has property of product === (RHS) product about to be added
      if (item.product.id === product.id) {
        cartItem.quantity = +item.quantity + 1; //Always force a conversion to number // Why not cartItem bcoz we're Increasing existing quantity of existing item // Adding 1 is allowed even if cartItem is const -- It means we pointing to the memory where object is stored
        cartItem.totalPrice = item.totalPrice + product.price;
        this.items[i] = cartItem;

        this.totalQuantity++;
        this.totalPrice += product.price;
        return;
      }
    }

    this.items.push(cartItem); // Add new element in the array -- But it could be the case adding same product multiple times but i want to aggregate them
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {
    //--Cases : 1) If negative or zero -- remove the product from cart 2) If positive -- add or change the number

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item }; //Copy of item I found
        const quantityChange = newQuantity - item.quantity;
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;
        this.items[i] = cartItem;

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price;
        return { updatedItemPrice: cartItem.totalPrice };
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1);
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice; // item.totalPrice - Totalprice for this single cart item
        return { updatedItemPrice: 0 };
      }
    }
  }
}

module.exports = Cart;
