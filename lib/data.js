const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

const lib = {};
lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback(500, { "Error:": "Could not close file." });
              }
            });
          } else {
            callback(500, { "Error:": "Could not write to new file." });
          }
        });
      } else {
        callback(500, {
          "Error:": "Could not create file. It may already exist"
        });
      }
    }
  );
};

lib.read = (dir, file, callback) => {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    (err, data) => {
      if (!err && data) {
        const parsedData = helpers.parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

lib.update = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, err => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, err => {
              if (!err) {
                fs.close(fileDescriptor, err => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback(500, { Status: "Error closing file." });
                  }
                });
              } else {
                callback(500, { Status: "Error writing to file." });
              }
            });
          } else {
            callback(500, { Status: "Error truncating file." });
          }
        });
      } else {
        callback(404, {
          "Status:": "could not open file for updating. It may not exist yet."
        });
      }
    }
  );
};

lib.delete = (dir, file, callback) => {};

module.exports = lib;
