const router = require("express").Router();
const Users = require("./../users/users-model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const tokenBuilder = require("./auth-token-builder");
const emailConfTokenBuilder = require("../users/email-conf-token-builder");
const crypto = require("crypto");
const makeID = () => {
  return crypto.randomBytes(5).toString("hex");
};

// [POST] /api/register - Register New User
router.post("/register", async (req, res, next) => {
  try {
    const { first_name, last_name, email, username, password } = req.body;

    if (!first_name || !last_name || !email || !username || !password) {
      next({ status: 400, message: "Please make sure all inputs are filled." });
    } else {
      const hashPassword = bcrypt.hashSync(password, 8);
      const insertedUser = await Users.insertUser({
        first_name,
        last_name,
        email,
        username,
        password: hashPassword,
        token: makeID(),
      });

      const retrievedEmail = email.trim();

      const emailToken = emailConfTokenBuilder(retrievedEmail);
      const url = `https://meek-klepon-9ced87.netlify.app/confirmation/${emailToken}`;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_PASS,
        },
      });

      let info = await transporter.sendMail({
        from: '"Secure Recipes" <bb6885302@hotmail.com>',
        to: retrievedEmail,
        subject: "Confirmation Email",
        html: `<p>Please click on link to confirm email.</p><a href=${url}>${url}</a>`,
      });

      console.log("Message sent: %s", info.messageId);
      res.status(200).json(insertedUser[0]);
    }
  } catch (err) {
    next(err);
    console.log(err);
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
        message: "Please make sure all inputs are filled.",
      });
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const token = tokenBuilder(user);

      res.status(200).json({ user, token });
    } else {
      next({ status: 400, message: "Invalid Credentials." });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
