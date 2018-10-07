const config = require("./config");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

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

helpers.getTemplate = (templateName, data, callback) => {
  templateName =
    typeof templateName === "string" && templateName.length > 0
      ? templateName
      : false;
  data = typeof data === "object" && data !== null ? data : {};
  if (templateName) {
    const templateDir = path.join(__dirname, "/../templates/");
    fs.readFile(templateDir + templateName + ".html", "utf-8", (err, str) => {
      if (!err && str && str.length > 0) {
        const finalString = helpers.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback("No template could be found.");
      }
    });
  } else {
    callback("A valid template name was not specified.");
  }
};

helpers.addUniversalTemplates = (str, data, callback) => {
  str = typeof str === "string" && str.length > 0 ? str : "";
  data = typeof data === "object" && data !== null ? data : {};

  // Get header and footer and wrap around the string
  helpers.getTemplate("_header", data, (err, headerString) => {
    if (!err && headerString) {
      helpers.getTemplate("_footer", data, (err, footerString) => {
        if (!err && footerString) {
          // Add them all together
          const fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback("could not footer template.");
        }
      });
    } else {
      callback("could not find header template.");
    }
  });
};

// Take a given string and a data object and find/replace all the keys within it.
helpers.interpolate = (str, data) => {
  str = typeof str === "string" && str.length > 0 ? str : "";
  data = typeof data === "object" && data !== null ? data : {};

  // add the template globals to thedata object prepending their keyname with global
  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data["global." + keyName] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object insert it's value in the string at the corresponding placeholder.
  for (let key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === "string") {
      const replace = data[key];
      const find = `{${key}}`;
      str = str.replace(find, replace);
    }
  }
  return str;
};

// Get the contents of a static/public asset
helpers.getStaticAsset = (fileName, callback) => {
  fileName =
    typeof fileName === "string" && fileName.length > 0 ? fileName : false;
  if (fileName) {
    const publicDir = path.join(__dirname, "/../public/");
    fs.readFile(publicDir + fileName, (err, data) => {
      if (!err && data) {
        callback(false, data);
      } else {
        callback("No file could be found.");
      }
    });
  } else {
    callback("A valid filename was not found.");
  }
};

module.exports = helpers;
