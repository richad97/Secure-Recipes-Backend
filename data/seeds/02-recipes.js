/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("recipes")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("recipes").insert([
        {
          title: "Grilled Cheese",
          prep_time: 10,
          source: "Family Recipe",
          pic_url:
            "https://res.cloudinary.com/diampwv1v/image/upload/v1647909722/yfnmgmvoz3x08uivv86t.jpg",

          category: "Snack",
          description: "Homemade grilled cheese.",
          instructions:
            "Butter pan before heating. Place bread on pan with cheese on top of one side. Stack when toasted.",
          category: "Snack",
          user_id: 1,
        },
        {
          title: "Quesadilla",
          prep_time: 10,
          source: "Online",
          pic_url:
            "https://res.cloudinary.com/diampwv1v/image/upload/v1647910211/oc2tnoh0auifz8knjta9.webp",
          category: "Lunch",
          description: "Homemade cheap quesadilla :)",
          instructions:
            "Butter pan before heating. Place tortilla on pan with cheese on top.",
          user_id: 1,
        },
        {
          title: "ramen",
          prep_time: 5,
          source: "online",
          pic_url: "",
          category: "lunch",
          description: "ramen",
          instructions: "Heat water. Add ramen and cook till done.",
          user_id: 2,
        },
      ]);
    });
};
