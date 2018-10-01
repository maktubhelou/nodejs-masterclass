const https = require("https");
const querystring = require("querystring");
const config = require("./config");
const util = require("util");
const debug = util.debuglog("mailgun");

const mailgun = {};

module.exports = mailgun;

mailgun.send = async (to, subject, text, html) => {
  return new Promise((resolve, reject) => {
    if (!to || !subject || (!text || !html)) {
      reject(new Error("Missing Required Fields."));
    }

    const payload = {
      to,
      subject,
      text,
      html,
      from: config.mailgun.from
    };

    const stringPayload = querystring.stringify(payload);

    const requestDetails = {
      protocol: "https:",
      hostname: config.mailgun.hostname,
      method: "POST",
      path: `/v3/${config.mailgun.domainName}/messages`,
      auth: `${config.mailgun.authUserName}:${config.mailgun.privateKey}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload)
      }
    };

    const request = https.request(requestDetails, response => {
      const status = response.statusCode;
      if (status === 200 || status === 201) {
        resolve();
      } else {
        debug(response);
        reject(new Error(`Email sending has failed with error: ${status}`));
      }
    });

    request.on("error", error => {
      reject(error);
    });
    request.write(stringPayload);
    request.end();
  });
};
