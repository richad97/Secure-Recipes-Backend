/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_friends")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_friends").insert([
        { user_id: 3, friend_id: 4 },
        { user_id: 4, friend_id: 3 },
      ]);
    });
};
