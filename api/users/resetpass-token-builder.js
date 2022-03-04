const jwt = require("jsonwebtoken");
const { JWT_RESETPASS } = process.env;

const resetPassTokenBuilder = (email) => {
  const payload = {
    email,
  };
  const options = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, JWT_RESETPASS, options);

  return token;
};

module.exports = resetPassTokenBuilder;
