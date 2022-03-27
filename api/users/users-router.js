const router = require("express").Router();
const Users = require("./users-model");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const {
  checkResetPassToken,
  checkConfirmationToken,
  checkPassword,
} = require("./users-middleware");
const resetPassTokenBuilder = require("./resetpass-token-builder");

// [GET] /api/users - Get All Users
router.get("/", checkPassword, async (req, res, next) => {
  try {
    const usersArr = await Users.findAllUsers();

    res.status(200).json(usersArr);
  } catch (err) {
    next(err);
  }
});

// [GET] /api/users/:id - Get User By ID
router.get("/:id", checkPassword, async (req, res, next) => {
  try {
    const user = await Users.findUserByID(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// [GET] /api/users/resetpassword/:email - Sends e-mail to param if it's in the db
router.get("/resetpassword/:email", async (req, res, next) => {
  try {
    const retrievedEmail = req.params.email.trim();
    const found = await Users.findBy({ email: retrievedEmail });

    if (found.length === 0) {
      next({
        status: 400,
        error: "E-mail not in database.",
      });
    } else {
      await sendEmail(
        retrievedEmail,
        resetPassTokenBuilder,
        "Reset Password",
        "resetpassword"
      );

      res.status(200).json({
        message: "E-mail has been sent.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [POST] /api/users/resetpassword - Actually changes password in database for user
router.post("/resetpassword", checkResetPassToken, async (req, res, next) => {
  try {
    const decodedEmail = req.body.decoded.email;
    const [foundByEmail] = await Users.findBy({ email: decodedEmail });

    const hashPassword = bcrypt.hashSync(req.body.newPassword, 8);
    const updatedUser = await Users.updateUser(foundByEmail.id, {
      password: hashPassword,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// [POST] /api/users/confirmation - changes confirmation to true
router.post("/confirmation", checkConfirmationToken, async (req, res, next) => {
  try {
    const decodedEmail = req.body.decoded.email;
    const [foundByEmail] = await Users.findBy({ email: decodedEmail });

    await Users.updateUser(foundByEmail.id, {
      confirmed: true,
    });

    res.status(200).json({ message: "Confirmed! Please log in to continue." });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
