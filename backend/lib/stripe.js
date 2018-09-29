const https = require("https");
const querystring = require("querystring");
const config = require("./config");
const _data = require("./data");

const stripe = {};

stripe.charge = async ({ amount, currency, source, description = "" }) => {
  return new Promise((resolve, reject) => {
    if (!amount || !source || !currency) {
      reject(new Error("Missing required payment fields."));
    }

    const payload = {
      amount: amount * 100,
      currency,
      source,
      description
    };

    const stringPayload = querystring.stringify(payload);

    const requestDetails = {
      protocol: "https:",
      hostname: config.stripe.host,
      method: "POST",
      path: "/v1/charges",
      auth: `${config.stripe.key}:`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload)
      }
    };

    const request = https.request(requestDetails, res => {
      const status = res.statusCode;
      if (status === 200 || status === 201) {
        resolve();
      } else {
        reject(new Error(`Payment has failed with status ${status}`));
      }
    });

    request.on("error", err => {
      reject(err);
    });

    console.log(stringPayload);

    request.write(stringPayload);

    request.end();
  });
};

module.exports = stripe;
