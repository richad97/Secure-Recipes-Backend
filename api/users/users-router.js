const router = require("express").Router();
const Users = require("./users-model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const resetPassTokenBuilder = require("./resetpass-token-builder");
const { JWT_RESETPASS, JWT_EMAIL_CONF_SECRET } = process.env;

// [GET] /api/users - Get All Users
router.get("/", async (req, res, next) => {
  try {
    const usersArr = await Users.findAllUsers();

    res.status(200).json(usersArr);
  } catch (err) {
    next(err);
  }
});

// [GET] /api/users/:id - Get User By ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await Users.findUserByID(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// send email if in db
router.get("/resetpassword/:email", async (req, res, next) => {
  try {
    const retrievedEmail = req.params.email.trim();
    let found = await Users.findBy({ email: retrievedEmail });

    if (found.length === 0) {
      next({
        status: 400,
        error: "E-mail not in database.",
      });
    } else {
      const emailToken = resetPassTokenBuilder(retrievedEmail);
      const url = `https://meek-klepon-9ced87.netlify.app/resetpassword/${emailToken}`;

      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_PASS,
        },
      });

      let info = await transporter.sendMail({
        from: '"Secret Recipes" <bb6885302@gmail.com>',
        to: retrievedEmail,
        subject: "Reset Password",
        html: `<p>Please click on link to reset password.</p><a href=${url}>${url}</a>`,
      });

      console.log("Message sent: %s", info.messageId);

      res.status(200).json({
        info: info.messageId,
        message: "E-mail has been sent.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// actually change password in database for user
router.post("/resetpassword", async (req, res, next) => {
  try {
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
            let decodedEmail = decoded.email;
            let [foundByEmail] = await Users.findBy({ email: decodedEmail });

            const hashPassword = bcrypt.hashSync(newPassword, 8);
            const updatedUser = await Users.updateUser(foundByEmail.id, {
              password: hashPassword,
            });

            res.status(200).json(updatedUser);
          }
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/confirmation", async (req, res, next) => {
  try {
    const emailToken = req.body.emailToken;

    if (!emailToken) {
      next({ status: 401, message: "Token Required" });
    } else {
      jwt.verify(emailToken, JWT_EMAIL_CONF_SECRET, async (err, decoded) => {
        if (err) {
          next({ status: 401, message: "Token Invalid" });
        } else {
          let decodedEmail = decoded.email;
          let [foundByEmail] = await Users.findBy({ email: decodedEmail });

          const confirmUser = await Users.updateUser(foundByEmail.id, {
            confirmed: true,
          });

          res
            .status(200)
            .json({ message: "Confirmed! Please log in to continue." });
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
