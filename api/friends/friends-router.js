const router = require("express").Router();
const Friends = require("./friends-model");
const Users = require("../users/users-model");
const Recipes = require("../recipes/recipes-model");
const { authorize } = require("../auth/auth-middleware");

router.post("/", authorize, async (req, res, next) => {
  try {
    const userID = req.decodedJWT.id;
    const confirmed = req.decodedJWT.confirmed;

    if (confirmed === false) {
      res
        .status(200)
        .json({ message: "Please confirm with the link in email to proceed." });
    } else {
      const usersFriends = await Friends.findUserFriends(userID);
      const [user] = await Users.findBy({ id: userID });

      res.status(200).json({ usersFriends, shareToken: user.token });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/addfriend", authorize, async (req, res, next) => {
  try {
    const shareToken = req.body.shareToken;
    const userID = req.decodedJWT.id;

    const result = await Friends.addToFriendsTable(userID, shareToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/recipes/:username", authorize, async (req, res, next) => {
  try {
    //  check if user is friends with username
    //  if friends, run friend through recipe model to get recipes

    const userID = req.decodedJWT.id;
    const friendsUsername = req.params.username.trim().toLowerCase();
    const usersFriends = await Friends.findUserFriends(userID);
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

router.delete("/delete/:id", authorize, async (req, res, next) => {
  try {
    const friendID = req.params.id;
    const deleteFriendship = await Friends.deleteFriendship(friendID);

    res.status(200).json(deleteFriendship);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
