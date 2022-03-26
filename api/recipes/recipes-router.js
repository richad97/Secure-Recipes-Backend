const router = require("express").Router();
const Recipes = require("../recipes/recipes-model");
const { authorize } = require("../auth/auth-middleware");

// [POST] /api/recipes - Recieve token and return user info and recipes
router.post("/", authorize, async (req, res, next) => {
  try {
    const { username, confirmed } = req.decodedJWT;

    if (confirmed === false) {
      next({
        status: 400,
        error: "Please confirm with the link in the email to proceed.",
      });
    } else {
      const returned = await Recipes.findRecipesByUser(username);

      res.status(200).json(returned);
    }
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

    if (!title || !instructions || ingredients.length === 0) {
      next({
        status: 400,
        error: "Title and instuctions must not be empty.",
      });
    } else {
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
    }
  } catch (err) {
    next(err);
  }
});

// [PUT] /api/recipes/edit/:id - Edits recipe
router.put("/edit/:id", authorize, async (req, res, next) => {
  try {
    const userID = req.decodedJWT.id;
    const username = req.decodedJWT.username;
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
    const { id } = req.params;

    if (!title || !instructions || ingredients.length === 0) {
      next({
        status: 400,
        error: "Title and instuctions must not be empty.",
      });
    } else {
      // check to see if recipe is by user
      const recipesByUser = await Recipes.findRecipesByUser(username);
      let foundOne = false;

      recipesByUser.forEach((recipe) => {
        if (recipe["recipe_id"] === Number(id)) {
          foundOne = true;
        }
      });

      if (foundOne === false) {
        next({ status: 400, error: "Recipe must belong to you." });
      } else if (foundOne === true) {
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
      }
    }
  } catch (err) {
    next(err);
  }
});

// [DELETE] /api/recipes/delete/:id - Delete recipe
router.delete("/delete/:id", authorize, async (req, res, next) => {
  try {
    const { id } = req.params;
    const username = req.decodedJWT.username;
    const recipesByUser = await Recipes.findRecipesByUser(username);
    let foundOne = false;

    recipesByUser.forEach((recipe) => {
      if (recipe["recipe_id"] === Number(id)) {
        foundOne = true;
      }
    });

    if (foundOne === false) {
      next({ status: 400, error: "Recipe must belong to you." });
    } else if (foundOne === true) {
      await Recipes.deleteRecipe(id);
      res.status(200).json("Successfully deleted recipe.");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
