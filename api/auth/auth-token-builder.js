const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const tokenBuilder = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    confirmed: user.confirmed,
  };
  const options = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, JWT_SECRET, options);

  return token;
};

module.exports = tokenBuilder;
