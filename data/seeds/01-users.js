/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "johndoe123",
          email: "johndoe123@example.com",
          first_name: "john",
          last_name: "doe",
          password:
            "$2b$08$Izdfqr6tXXwQSZz0PEsaqOfTw/mbTr6ipETMLv8uAFgzq8CZ9Buqi" /* password is 123 */,
          confirmed: true,
        },
        {
          username: "janedoe123",
          email: "janedoe123@example.com",
          first_name: "jane",
          last_name: "doe",
          password:
            "$2b$08$Izdfqr6tXXwQSZz0PEsaqOfTw/mbTr6ipETMLv8uAFgzq8CZ9Buqi" /* password is 123 */,
          confirmed: true,
        },
      ]);
    });
};
