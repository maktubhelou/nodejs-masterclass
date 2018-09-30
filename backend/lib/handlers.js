const _data = require("./data");
const helpers = require("./helpers");
const menu = require("./menu");
const handlers = {};
const ShoppingCart = require("./ShoppingCart");
const stripe = require("./stripe");
const mailgun = require("./mailgun");

handlers.greeting = (data, callback) => {
  callback(200, { Greeting: "Why hello there, what would you like to order?" });
};

handlers.users = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405, { Status: "Method not allowed." });
  }
};

handlers._users = {};

// Required data: firstName, lastName, phone, streetAddress, email, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const streetAddress =
    typeof data.payload.streetAddress === "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress.trim()
      : false;
  const email =
    typeof data.payload.email === "string" &&
    data.payload.email.trim().length > 0 &&
    data.payload.email.includes("@")
      ? data.payload.email.trim()
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length >= 8
      ? data.payload.password.trim()
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement === "boolean" ? true : false;
  if (
    firstName &&
    lastName &&
    phone &&
    streetAddress &&
    email &&
    password &&
    tosAgreement
  ) {
    const hashedPassword = helpers.hash(password);
    const userData = {
      firstName,
      lastName,
      phone,
      streetAddress,
      email,
      password: hashedPassword,
      tosAgreement
    };
    _data.create("users", phone, userData, err => {
      if (!err) {
        callback(200, { Status: "new user successfully created." });
      } else {
        callback(500, { Status: "Could not create new user." });
      }
    });
  } else {
    callback(405, { Status: "missing required fields." });
  }
};

handlers._users.get = (data, callback) => {
  const phone = data.queryStringObject.phone;
  handlers._tokens.verifyToken(token, phone, tokenIsValid => {
    if (tokenIsValid) {
      _data.read("users", phone, (err, data) => {
        if (!err && data) {
          const parsedData = helpers.parseJsonToObject(data);
          delete parsedData.password;
          callback(200, parsedData);
        } else {
          callback(404, { Status: "Could not find user." });
        }
      });
    } else {
      callback(405, { Error: "the provided token is not valid." });
    }
  });
};

// Users: put
// Required data: phone
// Optional data: firstName, lastName, streetAddress, email, password
handlers._users.put = (data, callback) => {
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const streetAddress =
    typeof data.payload.streetAddress === "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress.trim()
      : false;
  const email =
    typeof data.payload.email === "string" &&
    data.payload.email.trim().length > 0 &&
    data.payload.email.includes("@")
      ? data.payload.email.trim()
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length >= 8
      ? data.payload.password.trim()
      : false;
  if (phone) {
    if (firstName || lastName || streetAddress || email || password) {
      const token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      handlers._tokens.verifyToken(token, phone, tokenIsValid => {
        if (tokenIsValid) {
          _data.read("users", phone, (err, userData) => {
            if (!err) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (streetAddress) {
                userData.streetAddress = streetAddress;
              }
              if (email) {
                userData.email = email;
              }
              if (password) {
                userData.password = password;
              }
              _data.update("users", phone, userData, err => {
                if (!err) {
                  callback(200, { Status: "user successfully updated." });
                } else {
                  console.log(err);
                  callback(500, { Status: "could not update the user." });
                }
              });
            } else {
              callback(404, { Status: "The user cannot be found." });
            }
          });
        } else {
          callback(400, { Error: "no valid token provided." });
        }
      });
    } else {
      callback(400, { Status: "Missing field(s) to update." });
    }
  } else {
    callback(400, { Status: "Missing required field." });
  }
};

// Require: phone
// @TODO Clean up (delete) any other data files associated with this user.
handlers._users.delete = (data, callback) => {
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;
    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        _data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            _data.delete("users", phone, err => {
              if (!err) {
                callback(200, { Status: "user deleted." });
              } else {
                callback(400, {
                  Error: "could not delete the specified user."
                });
              }
            });
          } else {
            callback(404, { Error: "could not find the specified user." });
          }
        });
      } else {
        callback(405, { Error: "the provided token is not valid." });
      }
    });
  } else {
    callback(404, { Error: "That user does not seem to exist." });
  }
};

handlers.tokens = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405, { Status: "Method not allowed." });
  }
};

handlers._tokens = {};

handlers._tokens.post = (data, callback) => {
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 8
      ? data.payload.password.trim()
      : false;
  if (phone && password) {
    _data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        const hashedPassword = helpers.hash(password);
        if (hashedPassword === userData.password) {
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() * 1000 * 60 * 60 * 72;
          const tokenObject = {
            phone,
            tokenId,
            expires
          };
          _data.create("tokens", tokenId, tokenObject, err => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the token." });
            }
          });
        } else {
          callback(405, { Error: "the password is incorrect." });
        }
      } else {
        callback(400, { Error: "Could not find the specified user." });
      }
    });
  } else {
    callback(405, { Error: "Wrong credentials." });
  }
};
handlers._tokens.get = (data, callback) => {
  const id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404, "Token not found.");
      }
    });
  } else {
    callback(400, { Error: "cannot get token; missing required field." });
  }
};

handlers._tokens.put = (data, callback) => {
  const id =
    typeof data.payload.id == "string" && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;
  const extend = typeof data.payload.extend == "boolean" ? true : false;
  if (id && extend) {
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() * 1000 * 60 * 60 * 72;
          _data.update("tokens", id, tokenData, err => {
            if (!err) {
              callback(200, { Status: "token extended." });
            } else {
              callback(500, { Error: "could not extend token." });
            }
          });
        } else {
          callback(400, {
            Error: "the token has expired already and cannot be extended."
          });
        }
      } else {
        callback(400, { Error: "the specified token does not exist" });
      }
    });
  } else {
    callback(400, {
      "Error:": "Missing required field(s), or fields are invalid."
    });
  }
};

handlers._tokens.delete = (data, callback) => {
  const id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        _data.delete("tokens", id, err => {
          if (!err) {
            callback(200, { Status: "token deleted." });
          } else {
            callback(500, { Error: "could not delete the specified token." });
          }
        });
      } else {
        callback(400, { Error: "could not find the specified token." });
      }
    });
  } else {
    callback(400, { Error: "missing required field. (no token)" });
  }
};

handlers._tokens.verifyToken = (id, phone, callback) => {
  _data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

handlers.menu = (data, callback) => {
  callback(200, menu);
};

handlers.orders = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._orders[data.method](data, callback);
  } else {
    callback(405, { Status: "Method not allowed." });
  }
};

handlers._orders = {};

const shoppingCart = new ShoppingCart();

// Place an order
handlers._orders.post = (data, callback) => {
  const item =
    typeof data.payload.item === "string" && data.payload.item.trim().length > 0
      ? data.payload.item.trim()
      : false;
  const quantity =
    typeof data.payload.quantity === "number" && data.payload.quantity > 0
      ? data.payload.quantity
      : false;
  const price =
    typeof data.payload.price === "number" && data.payload.price > 0
      ? data.payload.price
      : false;
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length > 0
      ? data.payload.phone.trim()
      : false;
  const token =
    typeof data.headers.token === "string" &&
    data.headers.token.trim().length === 20
      ? data.headers.token
      : false;
  if (item && price && quantity && phone) {
    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        const itemToOrder = {
          title: item,
          price: price
        };
        shoppingCart.addToCart(itemToOrder, quantity);
        shoppingCart.calculateTotals();
        _data.read("orders", phone, (err, existingOrderData) => {
          if (err && !existingOrderData) {
            _data.create("orders", phone, shoppingCart, err => {
              if (!err) {
                callback(200);
              } else {
                callback(500);
              }
            });
          } else {
            _data.update("orders", phone, shoppingCart, err => {
              if (!err) {
                callback(200);
              } else {
                callback(500);
              }
            });
          }
        });
      } else {
        callback(405, { Error: "No token, or no valid token provided." });
      }
    });
  } else {
    callback(405, { Status: "Missing fields." });
  }
};

handlers._orders.delete = (data, callback) => {
  const item =
    typeof data.payload.item === "string" && data.payload.item.trim().length > 0
      ? data.payload.item.trim()
      : false;
  const quantity =
    typeof data.payload.quantity === "number" && data.payload.quantity > 0
      ? data.payload.quantity
      : false;
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const token =
    typeof data.headers.token === "string" &&
    data.headers.token.trim().length === 20
      ? data.headers.token.trim()
      : false;

  console.log(token, data.headers.token, data.headers.token.length);
  if (item && quantity && phone && token) {
    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        const itemToDelete = {
          title: item
        };
        shoppingCart.removeItem(itemToDelete, quantity);
        shoppingCart.calculateTotals();
        _data.read("orders", phone, (err, existingOrderData) => {
          if (err && !existingOrderData) {
            _data.create("orders", phone, shoppingCart, err => {
              if (!err) {
                callback(200);
              } else {
                callback(500);
              }
            });
          } else {
            _data.update("orders", phone, shoppingCart, err => {
              if (!err) {
                callback(200);
              } else {
                callback(500);
              }
            });
          }
        });
      } else {
        callback(405, { Error: "No token, or no valid token provided." });
      }
    });
  } else {
    callback(400, "Missing required fields.");
  }
};

// Read an order
// Need to be able to display open and closed orders
// Need to be able to display all orders in reverse cronological order
handlers._orders.get = (data, callback) => {
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;
  const token =
    typeof data.headers.token === "string" &&
    data.headers.token.trim().length === 20
      ? data.headers.token.trim()
      : false;
  if (phone && token) {
    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        _data.read("orders", phone, (err, orderData) => {
          if (!err && orderData) {
            callback(200, orderData);
          } else {
            callback(404, "order not found.");
          }
        });
      } else {
        callback(405, { Error: "No token, or no valid token provided." });
      }
    });
  } else {
    callback(400, "Missing required fields");
  }
};

handlers.pay = (data, callback) => {
  const acceptableMethods = ["post"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._pay[data.method](data, callback);
  } else {
    callback(405, { Status: "Method not allowed." });
  }
};

handlers._pay = {};

handlers._pay.post = async (data, callback) => {
  const { total, invoiceId, items } = shoppingCart.data;
  const token = "tok_visa";
  const currency = "usd";
  let details = "";
  items.forEach(
    item => (details += "<li>" + item.qty + " " + item.title + "(s)" + "</li>")
  );
  try {
    await stripe.charge({
      amount: total,
      currency,
      source: token,
      description: "Pizza DELIVERY Charge" + "-" + invoiceId
    });
    const email = "markallanevans@gmail.com";
    const subject = `Invoice for order number ${invoiceId}.`;
    const text = `Invoice: Your order for invoice number ${invoiceId} has been successful.\nThe charges come to $${total}.\n\n Please call us at 555-555-5555 if you have any last-minute requests within the next 5 seconds.`;
    const html = `<h1>Invoice:</h1><p>Your order for invoice number <strong>${invoiceId}</strong> has been successful.\nThe charges come to $${total}.\n\n Please call us at 555-555-5555 if you have any last-minute requests within the next 5 seconds.</p><ul>${details}</li>`;
    await mailgun.send(email, subject, text, html);
    callback(200);
  } catch (err) {
    callback(400, err);
  }
};

handlers.notFound = (data, callback) => {
  callback(404, {
    Status: "All the pizza at that address has been eaten."
  });
};

module.exports = handlers;
