const db = require("../../data/db-config");

const findAllUsers = () => {
  return db("users");
};

const findUserByID = (id) => {
  return db("users").where({ id });
};

const insertUser = async (credentials) => {
  const [resp] = await db("users").returning("id").insert(credentials);

  return findUserByID(resp.id);
};

const findBy = (filter) => {
  return db("users").where(filter);
};

function updateUser(id, changes) {
  return db("users")
    .where({ id })
    .update(changes)
    .then((rows) => {
      return findUserByID(id);
    });
}

module.exports = {
  findAllUsers,
  findUserByID,
  insertUser,
  findBy,
  updateUser,
};
