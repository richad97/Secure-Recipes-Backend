const crypto = require("crypto");
const generateRandStr = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

module.exports = generateRandStr;
