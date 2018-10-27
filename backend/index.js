const server = require("./lib/server");
const cli = require("./lib/cli");
// const workers = require("./lib/workers");

const app = {};

app.init = () => {
  server.init();
  // workers.init();
  setTimeout(() => {
    cli.init();
  }, 50);
};

app.init();

module.exports = app;
