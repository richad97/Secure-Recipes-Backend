const router = require("express").Router();
const Users = require("./users-model");
const Recipes = require("../recipes/recipes-model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const resetPassTokenBuilder = require("./resetpass-token-builder");
const { JWT_RESETPASS, JWT_EMAIL_CONF_SECRET } = process.env;
const { authorize } = require("../auth/auth-middleware");

// [GET] /api/users - Get All Users
router.get("/", async (req, res) => {
  try {
    const usersArr = await Users.findAllUsers();
    res.json(usersArr);
  } catch (err) {
    console.log(err);
  }
});

// [GET] /api/users/:id - Get User By ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findUserByID(req.params.id);

    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

// send email if in db
router.get("/resetpassword/:email", async (req, res) => {
  try {
    const retrievedEmail = req.params.email.trim();
    let found = await Users.findBy({ email: retrievedEmail });

    if (found.length === 0) {
      res.status(400).json({ message: "E-mail not in database" });
    } else {
      const emailToken = resetPassTokenBuilder(retrievedEmail);
      const url = `http://localhost:3000/resetpassword/${emailToken}`;

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

      res.json({
        info: info.messageId,
        message: "E-mail sent",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// actually change password in database for user
router.post("/resetpassword", async (req, res, next) => {
  try {
    const { emailToken, newPassword } = req.body;

    if (!emailToken) {
      next({ status: 401, meesage: "Token Required" });
    } else {
      jwt.verify(emailToken, JWT_RESETPASS, async (err, decoded) => {
        if (err) {
          next({ status: 401, message: "Token Invalid" });
        } else {
          if (!newPassword) {
            next({ status: 401, message: "Password can not be empty" });
          } else {
            let decodedEmail = decoded.email;
            let [foundByEmail] = await Users.findBy({ email: decodedEmail });

            const hashPassword = bcrypt.hashSync(newPassword, 8);
            const updatedUser = await Users.updateUser(foundByEmail.id, {
              password: hashPassword,
            });

            res.json(updatedUser);
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
});

router.post("/friends", authorize, async (req, res, next) => {
  try {
    const userID = req.decodedJWT.id;
    const usersFriends = await Users.findUserFriends(userID);
    res.json(usersFriends);
  } catch (err) {
    console.log(err);
  }
});

router.post("/addfriend", authorize, async (req, res, next) => {
  try {
    const shareToken = req.body.shareToken;
    const userID = req.decodedJWT.id;

    const result = await Users.addToFriendsTable(userID, shareToken);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/recipes/:username", authorize, async (req, res, next) => {
  try {
    //  check if user is friends with username
    //  if friends, run friend through recipe model to get recipes

    const userID = req.decodedJWT.id;
    const friendsUsername = req.params.username.trim().toLowerCase();
    const usersFriends = await Users.findUserFriends(userID);
    let keepGoing = false;

    usersFriends.forEach((obj) => {
      if (obj.username === friendsUsername) {
        keepGoing = true;
      }
    });

    if (keepGoing === false) {
      res.status(400).json({ message: "Not friends with this user" });
    } else if (keepGoing === true) {
      const returned = await Recipes.findRecipesByUser(friendsUsername);

      res.status(200).json(returned);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
