const router = require("express").Router();
const Users = require("./../users/users-model");
const bcrypt = require("bcrypt");
const tokenBuilder = require("./auth-token-builder");
const generateRandStr = require("../utils/generateRandStr");
const sendEmail = require("../utils/sendEmail");
const emailConfTokenBuilder = require("../users/email-conf-token-builder");

// [POST] /api/register - Register New User
router.post("/register", async (req, res, next) => {
  try {
    const { first_name, last_name, email, username, password } = req.body;

    if (!first_name || !last_name || !email || !username || !password) {
      next({ status: 400, error: "Please make sure all inputs are filled." });
    } else {
      const hashPassword = bcrypt.hashSync(password, 8);
      const insertedUser = await Users.insertUser({
        first_name,
        last_name,
        email,
        username,
        password: hashPassword,
        token: generateRandStr(5),
      });
      const retrievedEmail = email.trim();

      await sendEmail(
        retrievedEmail,
        emailConfTokenBuilder,
        "Confirm Account",
        "confirmation"
      );

      res.status(200).json(insertedUser[0]);
    }
  } catch (err) {
    next({ status: 500, error: "Unknown Error. Please try again later." });
  }
});

// [POST] /api/login - Register New User
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await Users.findBy({ username });

    if (!username || !password) {
      next({
        status: 400,
        error: "Please make sure all inputs are filled.",
      });
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const token = tokenBuilder(user);

      res.status(200).json({ user, token });
    } else {
      next({ status: 400, error: "Invalid Credentials." });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
