const jwt = require("jsonwebtoken");
const { JWT_RESETPASS, JWT_EMAIL_CONF_SECRET } = process.env;

const checkResetPassToken = (req, res, next) => {
  const { emailToken, newPassword } = req.body;

  if (!emailToken) {
    next({ status: 401, error: "Token Required" });
  } else {
    jwt.verify(emailToken, JWT_RESETPASS, async (err, decoded) => {
      if (err) {
        next({ status: 401, error: "Token Invalid" });
      } else {
        if (!newPassword) {
          next({ status: 401, error: "Password can not be empty" });
        } else {
          req.body.decoded = decoded;
          req.body.newPassword = newPassword;
          next();
        }
      }
    });
  }
};

const checkConfirmationToken = (req, res, next) => {
  const emailToken = req.body.emailToken;

  if (!emailToken) {
    next({ status: 401, error: "Token Required" });
  } else {
    jwt.verify(emailToken, JWT_EMAIL_CONF_SECRET, async (err, decoded) => {
      if (err) {
        next({ status: 401, error: "Token Invalid" });
      } else {
        req.body.decoded = decoded;
        next();
      }
    });
  }
};

const checkPassword = (req, res, next) => {
  const { password } = req.body;

  if (password !== "admin") {
    next({ status: 400, error: "Unauthorized." });
  } else {
    next();
  }
};

module.exports = { checkResetPassToken, checkConfirmationToken, checkPassword };
