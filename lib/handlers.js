const _data = require("./data");
const helpers = require("./helpers");

const handlers = {};

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
    const userData = {
      firstName,
      lastName,
      phone,
      streetAddress,
      email,
      password,
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
  _data.read("users", phone, (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      delete parsedData.password;
      callback(200, parsedData);
    } else {
      callback(404, { Status: "Could not find user." });
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
      callback(400, { Status: "Missing field(s) to update." });
    }
  } else {
    callback(400, { Status: "Missing required field." });
  }
};
handlers._users.delete = (data, callback) => {
  console.log("delete");
};

handlers.orders = (data, callback) => {
  callback(200, {
    Status: "The order function is still in the oven."
  });
};

handlers.notFound = (data, callback) => {
  callback(404, {
    Status: "All the pizza at that address has been eaten."
  });
};

module.exports = handlers;
