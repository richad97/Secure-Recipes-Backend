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

const findUserFriends = async (id) => {
  const friends = await db("user_friends").where({ user_id: id });
  const friendsRecipes = friends.map(async (obj) => {
    const friendID = obj["friend_id"];
    const [friend] = await findUserByID(friendID);

    const newData = {
      id: friend.id,
      username: friend.username,
      first_name: friend.first_name,
      last_name: friend.last_name,
    };

    return newData;
  });
  const results = await Promise.all(friendsRecipes);

  return friendsRecipes;
};

function addToFriendsTable() {
  // if no user is not found within this table
  // add user and friend to table (two records for each user)
}

module.exports = {
  findAllUsers,
  findUserByID,
  insertUser,
  findBy,
  updateUser,
  findUserFriends,
};
