const router = require("express").Router();
const Friends = require("./friends-model");
const Users = require("../users/users-model");
const Recipes = require("../recipes/recipes-model");
const { authorize } = require("../auth/auth-middleware");

// [POST] /api/friends - Retrieves friends of user
router.post("/", authorize, async (req, res, next) => {
  try {
    const userID = req.decodedJWT.id;
    const confirmed = req.decodedJWT.confirmed;

    if (confirmed === false) {
      next({
        status: 400,
        error: "Please confirm with the link in the email to proceed.",
      });
    } else {
      const usersFriends = await Friends.findUserFriends(userID);
      const [user] = await Users.findBy({ id: userID });

      res.status(200).json({ usersFriends, shareToken: user.token });
    }
  } catch (err) {
    next(err);
  }
});

// [POST] /api/friends/addfriend - Adds friend
router.post("/addfriend", authorize, async (req, res, next) => {
  try {
    const shareToken = req.body.shareToken;
    const userID = req.decodedJWT.id;
    const result = await Friends.addToFriendsTable(userID, shareToken);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// [POST] /api/friends/recipes/:username  - Retrieves recipe of friend
router.post("/recipes/:username", authorize, async (req, res, next) => {
  try {
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
      next({
        status: 400,
        error: "Not friends with this user.",
      });
    } else if (keepGoing === true) {
      const returned = await Recipes.findRecipesByUser(friendsUsername);

      res.status(200).json(returned);
    }
  } catch (err) {
    next(err);
  }
});

// [DELETE] /api/friends/delete/:id - Deletes friend
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
