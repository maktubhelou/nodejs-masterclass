const config = require("./config");
const crypto = require("crypto");

const helpers = {};

helpers.ansiColorString = {
  RED: "\x1b[31m%s\x1b[0m",
  GREEN: "\x1b[32m%s\x1b[0m",
  YELLOW: "\x1b[33m%s\x1b[0m",
  BLUE: "\x1b[34m%s\x1b[0m",
  MAGENTA: "\x1b[35m%s\x1b[0m",
  CYAN: "\x1b[36m%s\x1b[0m"
};

helpers.hash = str => {
  str = typeof str === "string" && str.length > 0 ? str : false;
  if (str) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

helpers.parseJsonToObject = str => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

helpers.createRandomString = strLength => {
  strLength =
    typeof strLength === "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    const possibleChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let outputString = "";
    for (i = 0; i < strLength; i++) {
      const randomChar = possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
      outputString += randomChar;
    }
    return outputString;
  } else {
    return false;
  }
};

module.exports = helpers;
