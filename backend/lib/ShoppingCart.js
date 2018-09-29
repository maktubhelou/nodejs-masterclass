class ShoppingCart {
  constructor() {
    this.data = {};
    this.data.invoiceId = "Invoice-" + Date.now();
    this.data.items = [];
    this.data.subTotal = 0;
    this.data.tax = 0;
    this.data.total = 0;
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
      console.log("item already in cart at: ", isInCart.itemIndex);
      this.data.items[isInCart.itemIndex].qty += qty;
    } else {
      this.data.items.push(prod);
    }
  }

  removeItem(product, qty) {
    const isInCart = this.itemInCart(product);
    console.log(isInCart, qty);
    if (isInCart.inCart) {
      console.log("item already in cart at: ", isInCart.itemIndex);
      const newQty = this.data.items;
      console.log(newQty);
      this.data.items[isInCart.itemIndex].qty -= qty;
    } else {
      console.log("item not in cart.");
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
  }
}

module.exports = ShoppingCart;
