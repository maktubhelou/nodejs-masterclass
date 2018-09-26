const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const handlers = require("./handlers");

const server = {};

server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))
};

server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    server.unifiedServer(req, res);
  }
);

server.unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headers = req.headers;
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", data => (buffer += decoder.write(data)));
  req.on("end", () => {
    buffer += decoder.end();
    const chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      // payload: helpers.parseJsonToObject(buffer),
      buffer: buffer
    };
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.setHeader("content-type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      if (statusCode === 200) {
        console.log(
          "\x1b[32m%s\x1b[0m",
          "SUCCESS: " +
            method.toUpperCase() +
            " " +
            trimmedPath +
            " " +
            statusCode +
            " " +
            payloadString
        );
      } else {
        console.log(
          "\x1b[31m%s\x1b[0m",
          "SUCCESS: " +
            method.toUpperCase() +
            " " +
            trimmedPath +
            " " +
            statusCode +
            " " +
            payloadString
        );
      }
    });
  });
};

server.router = {
  greeting: handlers.greeting,
  users: handlers.users,
  orders: handlers.orders
};

server.init = () => {
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      "\x1b[32m%s\x1b[0m",
      `Server is listening on port ${config.httpPort}.`
    );
  });
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      "\x1b[32m%s\x1b[0m",
      `Server is listening on port ${config.httpsPort}.`
    );
  });
};

module.exports = server;
