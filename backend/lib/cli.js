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
          if (!err && userData) {
            let line =
              "Name: " +
              userData.firstName +
              " " +
              userData.lastName +
              ", Phone: " +
              userData.phone;
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
    _data.read("users", userId, (err, userData) => {
      if (!err && userData) {
        delete userData.password;
        cli.verticalSpace();
        console.dir(userData, { colors: true });
      }
    });
  }
};
cli.responders.listCarts = () => {
  _data.list("carts", (err, cartIds) => {
    if (!err && cartIds && cartIds.length > 0) {
      cli.verticalSpace();
      cli.horizontalLine();
      cli.centered("CURRENT ORDERS");
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
