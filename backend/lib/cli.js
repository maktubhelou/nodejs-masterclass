// CLI Related Functions
const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
const os = require("os");
const v8 = require("v8");
const _data = require("./data");
const menu = require("./menu");

const e = new _events();

// Instantiate CLI module object
const cli = {};

// Input handlers
e.on("man", str => {
  cli.responders.help();
});
e.on("help", str => {
  cli.responders.help();
});
e.on("exit", str => {
  cli.responders.exit();
});
e.on("stats", str => {
  cli.responders.stats();
});
e.on("list users", str => {
  cli.responders.listUsers();
});
e.on("more user info", str => {
  cli.responders.moreUserInfo(str);
});
e.on("list carts", str => {
  cli.responders.listCarts();
});
e.on("list orders", str => {
  cli.responders.listOrders(str);
});
e.on("more order info", str => {
  cli.responders.moreOrderInfo(str);
});
e.on("more cart info", str => {
  cli.responders.moreCartInfo(str);
});
e.on("show menu", str => {
  cli.responders.menu();
});

// Formatting
cli.verticalSpace = lines => {
  lines = typeof lines === "number" && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log("");
  }
};

cli.horizontalLine = () => {
  const width = process.stdout.columns;
  let line = "";
  for (i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

cli.centered = str => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;
  const width = process.stdout.columns;

  const leftPadding = Math.floor((width - str.length) / 2);
  let line = "";
  for (i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;
  console.log(line);
};

// Responders
cli.responders = {};

cli.responders.help = () => {
  const commands = {
    man: "Display a list of commands available.",
    help: "Display a list of commands available.",
    exit: "Exit the CLI (and the rest of the application.",
    stats: "Get stats of the underlying OS and ressource utilization.",
    "list users": "Show a list of all registered users.",
    "more user info --{userId}": "Get more info for a specified user.",
    "list carts": "Show a list of current shopping carts.",
    "more cart info --{userId}": "Get more info on a specific cart.",
    "list orders --d --u":
      "Show a list of all orders received in the last 24 hours, (--d = delivered orders, --u = undelievered orders).",
    "more order info --{invoiceId}":
      "Show more order info about a specific order",
    "show menu": "Display all available items on menu"
  };

  cli.horizontalLine();
  cli.centered("CLI COMMANDS");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = "\x1b[34m" + key + "\x1b[0m";
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace();
  cli.horizontalLine();
};

cli.responders.exit = () => {
  process.exit(0);
};
cli.responders.stats = () => {
  const stats = {
    "Load Average": os.loadavg().join(" "),
    "CPU Count": os.cpus().length,
    "Free Memory": os.freemem(),
    "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
    "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
    "Allocated Heap Used (%)":
      Math.round(
        v8.getHeapStatistics().used_heap_size /
          v8.getHeapStatistics().total_heap_size
      ) * 100,
    "Available Heap Allocated":
      Math.round(
        v8.getHeapStatistics().total_heap_size /
          v8.getHeapStatistics().heap_size_limit
      ) * 100,
    Uptime: os.uptime + " seconds"
  };

  cli.horizontalLine();
  cli.centered("SYSTEM STATS");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (key in stats) {
    if (stats.hasOwnProperty(key)) {
      const value = stats[key];
      let line = "\x1b[34m" + key + "\x1b[0m";
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace();
  cli.horizontalLine();
};
cli.responders.listUsers = () => {
  _data.list("users", (err, userIds) => {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      cli.horizontalLine();
      cli.centered("REGISTERED USERS");
      cli.horizontalLine();
      cli.verticalSpace();
      userIds.forEach(userId => {
        _data.read("users", userId, (err, userData) => {
          const timeElapsedSinceRegistration = Date.now() - userData.createdAt;
          const newerThan24Hours =
            timeElapsedSinceRegistration < 24 * 60 * 60 * 1000 ? true : false;
          if (!err && userData && newerThan24Hours) {
            let line =
              "Email: " +
              userData.email +
              ", Name: " +
              userData.firstName +
              " " +
              userData.lastName +
              ", Phone: " +
              userData.phone +
              ", User Since " +
              (timeElapsedSinceRegistration / (60 * 60 * 1000)).toFixed(1) +
              " hours ago";
            console.log(line);
          }
        });
      });
    }
  });
};
cli.responders.moreUserInfo = str => {
  //@TODO : format the more user info to display the user info and the cart details with a bit more detail.
  arr = str.split("--");
  userId =
    typeof arr[1] === "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  if (userId) {
    const userIdType = userId.indexOf("@") > -1 ? "email" : "phone";
    if (userIdType === "email") {
      console.log("Please use the phone number to look up the user Id.");
    }
    _data.read("users", userId, (err, userData) => {
      if (!err && userData) {
        delete userData.password;
        cli.verticalSpace();
        console.dir(userData, { colors: true });
      }
    });
  }
  console.log(
    "That does not appear to be a valid user phone number to look up."
  );
};
cli.responders.listCarts = () => {
  _data.list("carts", (err, cartIds) => {
    if (!err && cartIds && cartIds.length > 0) {
      cli.verticalSpace();
      cli.horizontalLine();
      cli.centered("CURRENT OPEN CARTS");
      cli.horizontalLine();
      cli.verticalSpace();
      cartIds.forEach(cartId => {
        _data.read("carts", cartId, (err, cartData) => {
          // Check it is a .cart file, to only read .cart files
          cartId = cartId.indexOf("cart") > -1 ? cartId : false;
          if (!err && cartId && cartData) {
            let line =
              "Invoice ID: " +
              cartData.data.invoiceId +
              ", Customer : " +
              cartData.customerDetails.firstName +
              " " +
              cartData.customerDetails.lastName +
              ", Phone: " +
              cartData.customerDetails.phone +
              ", Total: " +
              cartData.data.formattedTotals.invoiceTotal;
            console.log(line);
          }
        });
      });
    }
  });
};
cli.responders.listOrders = str => {
  str = typeof str === "string" && str.trim().length > 0 ? str : "";

  _data.list("orders", (err, orderIds) => {
    if (!err && orderIds && orderIds.length > 0) {
      cli.verticalSpace();
      cli.horizontalLine();
      cli.centered("CURRENT OPEN ORDERS");
      cli.horizontalLine();
      cli.verticalSpace();
      orderIds.forEach(orderId => {
        _data.read("orders", orderId, (err, orderData) => {
          if (!err && orderId && orderData) {
            let lowerString = str.toLowerCase();
            let delivered =
              typeof orderData.delivered === "boolean"
                ? orderData.delivered
                : false;
            let hoursElapsedSinceReceipt = (
              (Date.now() - orderData.receivedAt) /
              (1000 * 60 * 60)
            ).toFixed(2);

            if (
              ((lowerString.indexOf("--d") > -1 && delivered) ||
                (lowerString.indexOf("--u") > -1 && !delivered) ||
                (lowerString.indexOf("--d") === -1 &&
                  lowerString.indexOf("--u") === -1)) &&
              hoursElapsedSinceReceipt < 24
            ) {
              let line =
                "ID:   " +
                orderData.invoiceId.slice(8) +
                "   , Customer Phone: " +
                orderData.phone +
                ", Street Address: " +
                orderData.streetAddress +
                ", Total: " +
                orderData.invoiceTotal +
                ", Delivered: " +
                orderData.delivered +
                ", Received " +
                hoursElapsedSinceReceipt +
                "hrs ago.";
              console.log(line);
            }
          }
        });
      });
    }
  });
};
cli.responders.moreCartInfo = str => {
  arr = str.split("--");
  cartId =
    typeof arr[1] === "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  if (cartId) {
    _data.read("carts", cartId + ".cart", (err, cartData) => {
      if (!err && cartData) {
        cli.verticalSpace();
        console.dir(cartData, { colors: true });
        console.log("Items");
        console.dir(cartData.data.items, { colors: true });
      }
    });
  }
};
cli.responders.moreOrderInfo = str => {
  arr = str.split("--");
  invoiceId =
    typeof arr[1] === "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  if (invoiceId) {
    _data.read("orders", "Invoice-" + invoiceId, (err, invoiceData) => {
      if (!err && invoiceData) {
        cli.verticalSpace();
        console.dir(invoiceData, { colors: true });
      }
    });
  }
};
cli.responders.menu = () => {
  cli.centered("MENU");
  cli.horizontalLine();
  cli.verticalSpace();
  cli.centered("PIZZAS");
  cli.horizontalLine();
  const width = process.stdout.columns;
  menu.pizzas.forEach(pizza => {
    const padding = 20 - pizza.item.length;
    let line = "";
    const pizzaType = "Type: " + pizza.item;
    line += pizzaType;
    for (i = 0; i < padding; i++) {
      line += " ";
    }
    const toppings = "Toppings: " + pizza.toppings.join(", ") + ". ";
    line += toppings;
    for (i = 0; i < 60 - toppings.length; i++) {
      line += " ";
    }
    const price =
      "Price: " +
      pizza.price.sm +
      "(SM) " +
      pizza.price.med +
      "(MED) " +
      pizza.price.lg +
      "(LG)";
    line += price;
    console.log(line);
  });
  cli.centered("SIDES");
  cli.horizontalLine();
  menu.sides.forEach(side => {
    const padding = 20 - side.item.length;
    let line = "";
    const sideType = "Type: " + side.item;
    line += sideType;
    for (i = 0; i < padding; i++) {
      line += " ";
    }
    const sidePrice = "Price: " + side.price;
    line += sidePrice;
    console.log(line);
  });
  cli.centered("DRINKS");
  cli.horizontalLine();
  menu.drinks.forEach(drink => {
    const padding = 20 - drink.item.length;
    let line = "";
    const drinkType = "Type: " + drink.item;
    line += drinkType;
    for (i = 0; i < padding; i++) {
      line += " ";
    }
    const drinkPrice = "Price: " + drink.price;
    line += drinkPrice;
    console.log(line);
  });
};

// Input processor
cli.processInput = str => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;
  if (str) {
    const uniqueInputs = [
      "man",
      "help",
      "exit",
      "stats",
      "list users",
      "more user info",
      "list carts",
      "more cart info",
      "list orders",
      "more order info",
      "show menu"
    ];

    // Go through possible inputs
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(input => {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;

        // Emit an event matching the unique input and include the full string given by the user
        e.emit(input, str);
        return true;
      }
    });

    // If no match is found, tell user to try again

    if (!matchFound) {
      console.log("Sorry, try again!");
    }
  }
};

// Init script
cli.init = () => {
  // Send the start message to the console
  console.log("\x1b[34m%s\x1b[0m", "The CLI is running.");

  // Start the interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Welcome, Admin! 😎 > "
  });

  // Create an initial prompt;
  _interface.prompt();

  // Handle each line of input separately.
  _interface.on("line", str => {
    // Send str to input processor
    cli.processInput(str);
    _interface.prompt();

    // If user stops CLI
    _interface.on("close", () => process.exit(0));
  });
};

module.exports = cli;
