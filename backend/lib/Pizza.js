const helpers = require("./helpers");

class Pizza {
  constructor(type, size, addedToppings) {
    // this.id = helpers.createRandomString(10);
    this.type = type;
    this.size = size;
    this.addedToppings = addedToppings;
  }
}

module.exports = Pizza;
