const https = require("https");
const querystring = require("querystring");
const config = require("./config");
const helpers = require("./helpers");
const util = require("util");
const debug = util.debuglog("stripe");

const stripe = {};

stripe.charge = async ({
  amount,
  currency,
  source,
  description = "",
  capture = true
}) => {
  return new Promise((resolve, reject) => {
    if (!amount || !source || !currency) {
      reject(new Error("Missing required payment fields."));
    }

    // Format the payload
    const payload = {
      amount,
      currency,
      source,
      description,
      capture
    };

    // Convert the payload to a string
    const stringPayload = querystring.stringify(payload);

    // Format request details
    const requestDetails = {
      protocol: "https:",
      hostname: config.stripe.host,
      port: 443,
      method: "POST",
      path: "/v1/charges",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
        Authorization: `Bearer ${config.stripe.key}`
      }
    };

    debug(helpers.ansiColorString.MAGENTA, stringPayload);

    const request = https.request(requestDetails, async res => {
      const status = res.statusCode;
      let responseBodyString = "";
      await res.on("data", chunk => {
        responseBodyString += chunk;
      });

      if (status === 200 || status === 201) {
        resolve({
          success: true,
          responseBody: JSON.parse(responseBodyString)
        });
      } else {
        reject({
          success: false,
          responseBody: JSON.parse(responseBodyString)
        });
      }
    });

    request.on("error", err => {
      reject(err);
    });

    request.write(stringPayload);

    request.end();
  });
};

module.exports = stripe;
