const db = require("../../data/db-config");

const findRecipesByUser = async (username) => {
  return db("recipes_ingredients")
    .select(
      "recipe_id",
      "recipes.created_at",
      "recipes.title",
      db.raw("array_agg(ingredients.ingredient) as ingredients"),
      "recipes.instructions",
      "recipes.prep_time",
      "recipes.description",
      "recipes.category",
      "recipes.source",
      "recipes.pic_url",
      "users.username"
    )
    .join("recipes", "recipes_ingredients.recipe_id", "recipes.id")
    .join("ingredients", "recipes_ingredients.ingredient_id", "ingredients.id")
    .join("users", "recipes.user_id", "users.id")
    .groupBy([
      "users.username",
      "recipes.created_at",
      "recipe_id",
      "recipes.title",
      "recipes.prep_time",
      "recipes.user_id",
      "recipes.source",
      "recipes.pic_url",
      "recipes.category",
      "recipes.instructions",
      "recipes.description",
    ])
    .where({ username });
};

const createRecipe = async (rest, ingredientsArr) => {
  //  Insert into recipes table
  const [recipeID] = await db("recipes").returning("id").insert(rest);

  //  Insert into ingredients table
  ingredientsArr.forEach(async (ing) => {
    const [ingredientID] = await db("ingredients")
      .returning("id")
      .insert({ ingredient: ing });

    //  Insert into recipes_ingredients table
    const recipesIngredientsInsert = await db("recipes_ingredients").insert({
      recipe_id: recipeID.id,
      ingredient_id: ingredientID.id,
    });
  });
};

const updateRecipe = async (id, rest, ingredientsArr) => {
  //  Updates everything in recipe except ingredients
  const [updatedRecipeID] = await db("recipes")
    .returning("id")
    .update(rest)
    .where({ id });

  (async function deleteOldIngredients() {
    const oldIngredients = await db("recipes_ingredients")
      .select([
        "recipes_ingredients.recipe_id",
        "ingredients.id",
        "ingredients.ingredient",
      ])
      .join(
        "ingredients",
        "recipes_ingredients.ingredient_id",
        "ingredients.id"
      )
      .where({ recipe_id: id });

    oldIngredients.forEach(async (ing, i) => {
      const ingredient = ing["ingredient"];
      const ingredientID = ing["id"];
      await db("ingredients").where({ id: ingredientID }).del();
    });
  })();

  (async function addNewIngredients() {
    ingredientsArr.forEach(async (ing) => {
      const [ingredientID] = await db("ingredients")
        .returning("id")
        .insert({ ingredient: ing });

      const recipesIngredientsInsert = await db("recipes_ingredients").insert({
        recipe_id: id,
        ingredient_id: ingredientID.id,
      });
    });
  })();

  return updatedRecipeID;
};

const deleteRecipe = async (id) => {
  return await db("recipes").where({ id }).del();
};

module.exports = {
  findRecipesByUser,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
