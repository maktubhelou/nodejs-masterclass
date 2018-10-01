const util = require("util");
const debug = util.debuglog("ShoppingCart");

class ShoppingCart {
  constructor() {
    this.data = {};
    this.data.invoiceId = "Invoice-" + Date.now();
    this.data.email = "";
    this.data.items = [];
    this.data.subTotal = 0;
    this.data.tax = 0;
    this.data.total = 0;
    this.data.stripeTotal = 0;
  }

  itemInCart(product) {
    let inCart = false;
    let itemIndex = -1;
    this.data.items.forEach((item, index) => {
      if (item.title === product.title) {
        inCart = true;
        itemIndex = index;
      }
    });
    return { inCart, itemIndex };
  }

  addToCart(product = null, qty = 1) {
    let prod = {
      id: product.id,
      title: product.title,
      price: product.price,
      qty: qty
    };
    const isInCart = this.itemInCart(product);
    if (isInCart.inCart) {
      debug("item already in cart at: ", isInCart.itemIndex);
      this.data.items[isInCart.itemIndex].qty += qty;
    } else {
      this.data.items.push(prod);
    }
  }

  removeItem(product, qty) {
    const isInCart = this.itemInCart(product);
    debug(isInCart, qty);
    if (isInCart.inCart) {
      debug("item already in cart at: ", isInCart.itemIndex);
      const newQty = this.data.items;
      this.data.items[isInCart.itemIndex].qty -= qty;
    } else {
      debug("item not in cart.");
    }
  }

  calculateTotals() {
    this.data.subTotal = 0;
    this.data.items.forEach(item => {
      let price = item.price;
      let qty = item.qty;
      const amount = price * qty;
      this.data.subTotal += amount;
    });
    this.data.tax = this.data.subTotal * 0.15;
    this.data.total = this.data.subTotal + this.data.tax;
    this.data.invoiceTotal = Math.ceil(this.data.total * 100) / 100;
    this.data.stripeTotal = Math.ceil(this.data.total * 100);
  }
}

module.exports = ShoppingCart;
