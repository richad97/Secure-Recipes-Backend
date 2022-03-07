const jwt = require("jsonwebtoken");
const { JWT_EMAIL_CONF_SECRET } = process.env;

const emailConfTokenBuilder = (email) => {
  const payload = {
    email,
  };
  const options = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, JWT_EMAIL_CONF_SECRET, options);

  return token;
};

module.exports = emailConfTokenBuilder;
