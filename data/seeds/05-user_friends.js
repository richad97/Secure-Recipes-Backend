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
        { user_id: 98, friend_id: 99 },
        { user_id: 99, friend_id: 98 },
      ]);
    });
};
