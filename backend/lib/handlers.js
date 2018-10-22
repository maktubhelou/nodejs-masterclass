const _data = require("./data");
const helpers = require("./helpers");
const menu = require("./menu");
const handlers = {};
const ShoppingCart = require("./ShoppingCart");
const Pizza = require("./Pizza");
const stripe = require("./stripe");
const mailgun = require("./mailgun");
const util = require("util");
const debug = util.debuglog("handlers");

/*
*
* HTML Handlers
*
*/

handlers.index = (data, callback) => {
  if (data.method === "get") {
    debug(helpers.ansiColorString.MAGENTA, "Beginning Index Call");
    // Prepare data for interpolation.
    const templateData = {
      "head.title": "Pizzapp - Pizza Your Way, Every Day",
      "head.description": "Simple. Fast. Delicious.",
      "body.class": "index"
    };

    // Read in the template as a string
    helpers.getTemplate("index", templateData, (err, str) => {
      debug("Retrieving Template Data");
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          debug("Template Data Retrieved", templateData);
          if (!err && fullString) {
            debug(helpers.ansiColorString.MAGENTA, "Success");
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Favicon
handlers.favicon = (data, callback) => {
  if (data.method === "get") {
    helpers.getStaticAsset("favicon.ico", (err, faviconData) => {
      if (!err && faviconData) {
        callback(200, faviconData, "favicon");
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public assets
handlers.public = (data, callback) => {
  if (data.method === "get") {
    // Get the filename being requested
    const trimmedAssetName = data.trimmedPath.replace("public", "").trim();
    if (trimmedAssetName.length > 0) {
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && data) {
          // Determine the content type and default to plain.
          let contentType = "plain";
          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }
          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }
          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }
          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = "favicon";
          }
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

// Create an Account
handlers.accountCreate = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds.",
      "body.class": "accountCreate"
    };

    // Read in the template as a string
    helpers.getTemplate("accountCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Log in
handlers.sessionCreate = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Log in to your Account",
      "head.description": "Login to start ordering your favourite pizza.",
      "body.class": "sessionCreate"
    };

    // Read in the template as a string
    helpers.getTemplate("sessionCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};
// Edit Account
handlers.accountEdit = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Edit Your Account Details",
      "head.description": "Edit Your Account Details or Delete Your Account.",
      "body.class": "accountEdit"
    };

    // Read in the template as a string
    helpers.getTemplate("accountEdit", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};
// Account Deleted
handlers.accountDeleted = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Account Deleted",
      "body.class": "accountDeleted"
    };

    // Read in the template as a string
    helpers.getTemplate("accountDeleted", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};
// Place Order
handlers.placeOrder = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Place Your Oder",
      "head.description": "Place an Order here.",
      "body.class": "placeOrder"
    };

    // Read in the template as a string
    helpers.getTemplate("placeOrder", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};
// View Cart
handlers.viewCart = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Review your Order",
      "head.description": "See your current order here.",
      "body.class": "viewCart"
    };

    // Read in the template as a string
    helpers.getTemplate("viewCart", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};
// Edit Account
handlers.sessionDeleted = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Logged Out",
      "head.description": "You have been logged out of your account.",
      "body.class": "sessionDeleted"
    };

    // Read in the template as a string
    helpers.getTemplate("sessionDeleted", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

handlers.cartsList = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Shopping Carts",
      "head.description":
        "Here are all the current Shopping Carts you have in the aisles.",
      "body.class": "cartsList"
    };

    // Read in the template as a string
    helpers.getTemplate("cartsList", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

handlers.viewMenu = (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation.
    const templateData = {
      "head.title": "Pizza Menu",
      "head.description":
        "Here are all the delicious menu items available to you!",
      "body.class": "viewMenu"
    };

    // Read in the template as a string
    helpers.getTemplate("viewMenu", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal templates.
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

/*
*
* JSON Api Handlers
*
*/

handlers.greeting = (data, callback) => {
  callback(200, { Greeting: "Why hello there, what would you like to order?" });
};

handlers.ping = (data, callback) => {
  callback(200);
};

handlers.users = (data, callback) => {
  debug(helpers.ansiColorString.BLUE, data.method);
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
  debug(
    helpers.ansiColorString.BLUE,
    "Create User Post Request Received by API.",
    data
  );
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
  debug(
    helpers.ansiColorString.GREEN,
    `${firstName} ${lastName} ${phone} ${streetAddress} ${email} ${password} ${tosAgreement}`
  );
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
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;
  console.log(phone, token);
  handlers._tokens.verifyToken(token, phone, tokenIsValid => {
    if (tokenIsValid) {
      _data.read("users", phone, (err, data) => {
        console.log(data);
        if (!err && data) {
          delete data.password;
          callback(200, data);
        } else {
          callback(404, { Status: "Could not find user." });
        }
      });
    } else {
      callback(405, {
        Error: "Cannot retrieve user. The provided token is not valid."
      });
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
                  debug(err);
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
            // _data.delete("cart", phone, err => {
            //   if (!err) {
            //     callback(200, { Status: "carts deleted." });
            //   } else {
            //     callback(400, {
            //       Error: "could not delete the specified user."
            //     });
            //   }
            // });
            _data.delete("users", phone, err => {
              if (!err) {
                callback(200, { Status: "user deleted." });
              } else {
                callback(400, {
                  Error: "could not delete the specified user's shopping carts."
                });
              }
            });
            // _data.delete("tokens", token, err => {
            //   if (!err) {
            //     callback(200, { Status: "token deleted." });
            //   } else {
            //     callback(400, {
            //       Error: "could not delete the specified user's tokens."
            //     });
            //   }
            // });
          } else {
            callback(404, { Error: "could not find the specified user." });
          }
        });
      } else {
        callback(405, {
          Error: "The token you are attempting to verify is not valid."
        });
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

// Container for tokens handlers
handlers._tokens = {};

// Create a token
handlers._tokens.post = (data, callback) => {
  // Validate data
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length >= 8
      ? data.payload.password.trim()
      : false;

  if (phone && password) {
    // Read user data
    _data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        const hashedPassword = helpers.hash(password);
        if (hashedPassword === userData.password) {
          const email = userData.email;
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() * 1000 * 60 * 60 * 72;
          const tokenObject = {
            phone,
            email,
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

// Required fields: email, phone, streetAddress
// Optional fields: none
handlers._pay.post = async (data, callback) => {
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const email =
    typeof data.payload.email === "string" &&
    data.payload.email.trim().length > 0 &&
    data.payload.email.includes("@")
      ? data.payload.email.trim()
      : false;
  const streetAddress =
    typeof data.payload.streetAddress === "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress.trim()
      : false;
  if (phone && email && streetAddress) {
    const token =
      typeof data.headers.token === "string" &&
      data.headers.token.trim().length === 20
        ? data.headers.token.trim()
        : false;
    handlers._tokens.verifyToken(token, phone, async tokenIsValid => {
      if (tokenIsValid) {
        const {
          stripeTotal,
          invoiceTotal,
          invoiceId,
          items
        } = shoppingCart.data;
        const stripeToken = "tok_visa";
        const currency = "usd";
        let details = "";
        items.forEach(item => {
          if (item.qty === 1) {
            details += "<li>" + item.qty + " " + item.title + "</li>";
          } else {
            details += "<li>" + item.qty + " " + item.title + "s</li>";
          }
        });
        try {
          await stripe.charge({
            amount: stripeTotal,
            currency,
            source: stripeToken,
            description: "Pizza DELIVERY Charge" + "-" + invoiceId
          });

          const orderObj = {
            email,
            invoiceId,
            invoiceTotal,
            details,
            streetAddress,
            phone
          };

          await handlers.sendEmailInvoice(orderObj);
          callback(200);
        } catch (err) {
          callback(400, err);
        }
      } else {
        callback(405, "Missing credentials.");
      }
    });
  } else {
    callback(400, "Missing Required field(s).");
  }
};

handlers.carts = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._carts[data.method](data, callback);
  } else {
    callback(405, { Status: "Method not allowed." });
  }
};

handlers._carts = {};

// Create a shopping cart
// Required data: token
handlers._carts.post = (data, callback) => {
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;
  const pizza = typeof data.payload == "object" ? data.payload : false;
  _data.read("tokens", token, (err, tokenData) => {
    if (!err && tokenData) {
      const phone = tokenData.phone;
      const customerDetails = {
        phone
      };
      _data.read("users", phone, (err, userData) => {
        if (!err && userData) {
          customerDetails.email = userData.email;
          customerDetails.streetAddress = userData.streetAddress;
          customerDetails.firstName = userData.firstName;
          customerDetails.lastName = userData.lastName;
          let addedPizza = {};
          if (pizza) {
            addedPizza = new Pizza(pizza.type, pizza.size, pizza.addedToppings);
          }
          const shoppingCart = new ShoppingCart();
          shoppingCart.addCustomerDetails(customerDetails);
          shoppingCart.addToCart(addedPizza);
          shoppingCart.calculateTotals();
          _data.create("carts", phone, shoppingCart, err => {
            if (!err) {
              callback(200, shoppingCart);
            } else {
              callback(500, {
                Error: `Could not create cart, or cart already exists. Use PUT Method to update order ID# ${
                  shoppingCart.data.invoiceId
                }.`
              });
            }
          });
        } else {
          callback(500);
        }
      });
    } else {
      callback(403, { Error: "Token data is incorrect. Please log in again." });
    }
  });
};

// Read a shopping cart
handlers._carts.get = (data, callback) => {
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;
  if (token) {
    _data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const phone = tokenData.phone;
        _data.read("carts", phone, (err, cartData) => {
          if (!err && cartData) {
            callback(false, cartData);
          } else {
            callback(400, { Status: "Cannot find order data." });
          }
        });
      } else {
        callback(400, { Status: "Cannot find the required information." });
      }
    });
  } else {
    callback(400, { Status: "Missing Credentials." });
  }
};

// Update a shopping cart
handlers._carts.put = (data, callback) => {
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;
  const pizza =
    typeof data.payload.pizza == "object" ? data.payload.pizza : false;
  _data.read("tokens", token, (err, tokenData) => {
    if (!err && tokenData) {
      const phone = tokenData.phone;
      _data.read("carts", phone, (err, cartData) => {
        if (!err && cartData) {
          const shoppingCart = new ShoppingCart();
          shoppingCart.data = cartData.data;
          shoppingCart.customerDetails = cartData.customerDetails;
          let addedPizza = {};
          if (pizza) {
            addedPizza = new Pizza(pizza.type, pizza.size, pizza.addedToppings);
          }
          shoppingCart.addToCart(addedPizza);
          shoppingCart.calculateTotals();
          _data.update("carts", phone, shoppingCart, err => {
            if (!err) {
              callback(200, shoppingCart);
            } else {
              callback(500, {
                Error: `Could not create cart, or cart already exists. Use PUT Method to update order ID# ${
                  shoppingCart.data.invoiceId
                }.`
              });
            }
          });
        } else {
          callback(500);
        }
      });
    } else {
      callback(403, { Error: "Token data is incorrect. Please log in again." });
    }
  });
};

// Delete a shopping cart
handlers._carts.delete = (data, callback) => {
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;
  if (token) {
    _data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const phone = tokenData.phone;
        _data.delete("carts", phone, err => {
          if (!err) {
            callback(200, { Status: "the order has been deleted." });
          } else {
            callback(400, { Status: "Cannot find order data." });
          }
        });
      } else {
        callback(400, { Status: "Cannot find the required information." });
      }
    });
  } else {
    callback(400, { Status: "Missing Credentials." });
  }
};

handlers.sendEmailInvoice = async orderObj => {
  const { invoiceId, invoiceTotal, streetAddress, email, details } = orderObj;
  const subject = `Invoice for order number ${invoiceId}.`;
  const text = `Invoice: Your order for invoice number ${invoiceId} has been successful.\nThe charges come to $${invoiceTotal}.\n\n Please call us at 555-555-5555 if you have any last-minute requests within the next 5 seconds.`;
  const html = `<h1>Invoice:</h1><p>Your order for invoice number <strong>${invoiceId}</strong> has been successful.\nThe charges come to $${invoiceTotal}.\n\n Please call us at 555-555-5555 if you have any last-minute requests within the next 5 seconds.</p><ul>${details}</li><p>This order will be shipped to ${streetAddress}.</p>`;
  await mailgun.send(email, subject, text, html);
};

handlers.notFound = (data, callback) => {
  callback(404, {
    Status: "All the pizza at that address has been eaten."
  });
};

module.exports = handlers;
