exports.up = (knex) => {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments();
      tbl.string("first_name", 128).notNullable();
      tbl.string("last_name", 128);
      tbl.string("email", 128).unique().notNullable();
      tbl.string("username").unique().notNullable();
      tbl.string("password").notNullable();
      tbl.boolean("confirmed").notNullable().defaultTo(false);
      tbl.string("token");
      tbl.timestamps(true, true);
    })
    .createTable("recipes", (tbl) => {
      tbl.increments();
      tbl.string("title", 128).notNullable();
      tbl.text("description");
      tbl.integer("prep_time");
      tbl.string("category", 128);
      //.notNullable();
      tbl.string("source", 128);
      tbl.text("instructions").notNullable();
      tbl.string("pic_url", 200);
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.timestamps(true, true);
    })
    .createTable("ingredients", (tbl) => {
      tbl.increments();
      tbl.string("ingredient").notNullable();
    })
    .createTable("recipes_ingredients", (tbl) => {
      tbl
        .integer("recipe_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("recipes")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("ingredient_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("ingredients")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      tbl.primary(["recipe_id", "ingredient_id"]);
    })
    .createTable("user_friends", (tbl) => {
      tbl.increments();
      tbl.integer("user_id").notNullable();
      tbl.integer("friend_id").notNullable();
    });
};
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("user_friends")
    .dropTableIfExists("recipes_ingredients")
    .dropTableIfExists("ingredients")
    .dropTableIfExists("recipes")
    .dropTableIfExists("users");
};
