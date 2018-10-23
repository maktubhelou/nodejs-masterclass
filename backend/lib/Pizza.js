const helpers = require("./helpers");

class Pizza {
  constructor(type, size, addedToppings, qty) {
    // this.id = helpers.createRandomString(10);
    this.type = type;
    this.size = size;
    this.addedToppings = addedToppings;
    this.qty = parseInt(qty, 0);
  }
}

module.exports = Pizza;
