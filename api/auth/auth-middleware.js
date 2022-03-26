const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authorize = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    next({ status: 401, error: "Token Required." });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        next({ status: 401, error: "Token Invalid." });
      } else {
        req.decodedJWT = decoded;
        next();
      }
    });
  }
};

module.exports = { authorize };
