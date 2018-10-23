const helpers = require("./helpers");
const util = require("util");
const debug = util.debuglog("ShoppingCart");

class ShoppingCart {
  constructor() {
    this.data = {};
    this.customerDetails = {};
    this.data.invoiceId = "Invoice-" + Date.now();
    this.data.items = [];
    this.data.subTotal = 0;
    this.data.tax = 0;
    this.data.total = 0;
    this.data.stripeTotal = 0;
    this.data.sizeTally = { sm: 0, med: 0, lg: 0 };
  }

  addCustomerDetails(detailObject) {
    this.customerDetails = detailObject;
  }

  addToCart(pizzaObj) {
    let indexOfMatch = false;
    this.data.items.forEach((item, index) => {
      if (item.type == pizzaObj.type && item.size == pizzaObj.size) {
        indexOfMatch = index;
        return;
      }
    });
    console.log(indexOfMatch);
    if (indexOfMatch) {
      this.data.items[indexOfMatch].qty += 1;
    }
    if (!indexOfMatch) {
      this.data.items.push(pizzaObj);
    }
  }

  // @TODO add removeItems method

  calculateTotals() {
    this.data.subTotal = 0;
    const newsizeTally = { sm: 0, med: 0, lg: 0 };

    this.data.items.forEach(item => {
      switch (item.size) {
        case "sm":
          newsizeTally.sm++;
          break;
        case "med":
          newsizeTally.med++;
          break;
        case "lg":
          newsizeTally.lg++;
          break;
      }
    });
    this.data.sizeTally = newsizeTally;
    const { sm, med, lg } = this.data.sizeTally;
    this.data.subTotal = sm * 8 + med * 12 + lg * 15;
    this.data.tax = this.data.subTotal * 0.15;
    this.data.total = this.data.subTotal + this.data.tax;
    this.data.invoiceTotal = Math.ceil(this.data.total * 100) / 100;
    this.data.stripeTotal = Math.ceil(this.data.total * 100);
  }
}

module.exports = ShoppingCart;

// const newCart = new ShoppingCart();
// newCart.addCustomerDetails({
//   name: "Mark",
//   phone: "0938396003",
//   email: "markallanevans@gmail.com"
// });

// newCart.addToCart({ type: "pep", size: "sm", qty: 1 });
// newCart.addToCart({ type: "moz", size: "med", qty: 1 });
// newCart.addToCart({ type: "moz", size: "med", qty: 1 });
// newCart.addToCart({ type: "moz", size: "med", qty: 1 });
// newCart.addToCart({ type: "moz", size: "lg", qty: 1 });
// newCart.addToCart({ type: "moz", size: "med", qty: 1 });
// newCart.addToCart({ type: "moz", size: "med", qty: 1 });
// newCart.addToCart({ type: "moz", size: "med", qty: 1 });
// newCart.addToCart({ type: "haw", size: "sm", qty: 3 });
// newCart.addToCart({ type: "veg", size: "lg", qty: 2 });
// newCart.addToCart({ type: "chk", size: "sm", qty: 1 });
// newCart.addToCart({ type: "buf", size: "sm", qty: 1 });

// newCart.calculateTotals();

// console.log(newCart.data.items);
