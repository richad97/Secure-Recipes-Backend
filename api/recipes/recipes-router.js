const router = require("express").Router();
const Recipes = require("../recipes/recipes-model");
const { authorize } = require("../auth/auth-middleware");

// [POST] /api/recipes - Recieve token and return user info and recipes
router.post("/", authorize, async (req, res, next) => {
  try {
    const { username, confirmed } = req.decodedJWT;
    // if (confirmed === false) {
    //   res.json("User must confirm by link inside email address.");
    // } else {
    const returned = await Recipes.findRecipesByUser(username);

    res.status(200).json(returned);
    // }
  } catch (err) {
    next(err);
  }
});

// [POST] /api/recipes/create - Creates recipe
router.post("/create", authorize, async (req, res, next) => {
  try {
    const userID = req.decodedJWT.id;
    const {
      title,
      prep_time,
      source,
      pic_url,
      category,
      ingredients,
      instructions,
      description,
    } = req.body;

    if (!title || !instructions) {
      return res
        .status(400)
        .json({ message: "Title and instructions must not be empty." });
    }
    const createdRecipe = await Recipes.createRecipe(
      {
        title,
        prep_time,
        source,
        pic_url,
        category,
        instructions,
        description,
        user_id: userID,
      },
      ingredients
    );
    res.status(200).json({ message: "Recipe created." });
  } catch (err) {
    next(err);
  }
});

// [PUT] /api/recipes/edit/:id - Edits recipe
router.put("/edit/:id", authorize, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userID = req.decodedJWT.id;
    const {
      title,
      prep_time,
      source,
      pic_url,
      category,
      ingredients,
      instructions,
      description,
    } = req.body;

    if (!title || !instructions) {
      return res
        .status(400)
        .json({ message: "Title and instructions must not be empty." });
    }

    const editedRecipe = await Recipes.updateRecipe(
      id,
      {
        title,
        prep_time,
        source,
        pic_url,
        category,
        instructions,
        description,
        user_id: userID,
      },
      ingredients
    );
    res.status(200).json(editedRecipe);
  } catch (err) {
    next(err);
  }
});

// [DELETE] /api/recipes/delete/:id - Delete recipe
router.delete("/delete/:id", authorize, async (req, res, next) => {
  try {
    const { id } = req.params;

    await Recipes.deleteRecipe(id);

    res.status(200).json("Successfully deleted recipe.");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
