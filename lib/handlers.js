const handlers = {};

handlers.greeting = (data, callback) => {
  callback(200, { Greeting: "Why hello there, what would you like to order?" });
};

handlers.users = (data, callback) => {
  callback(200, {
    Status:
      "The user service has not been created yet. Stay tuned for tastier toppings."
  });
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
  const firstName = typeof data.payload.firstName;
  console.log("post");
};
handlers._users.get = (data, callback) => {
  console.log(200, { Status: "Callback received." });
};
handlers._users.put = (data, callback) => {
  console.log("put");
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
