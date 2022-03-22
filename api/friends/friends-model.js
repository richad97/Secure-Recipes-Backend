const db = require("../../data/db-config");
const Users = require("../users/users-model");

const findUserFriends = async (id) => {
  const friends = await db("user_friends").where({ user_id: id });
  const friendsRecipes = friends.map(async (obj) => {
    const friendID = obj["friend_id"];
    const [friend] = await Users.findUserByID(friendID);

    const newData = {
      id: friend.id,
      username: friend.username,
      first_name: friend.first_name,
      last_name: friend.last_name,
    };

    return newData;
  });
  const results = await Promise.all(friendsRecipes);

  return results;
};

const addToFriendsTable = async (initUserID, recivedToken) => {
  try {
    const [friend] = await Users.findBy({ token: recivedToken });
    if (friend) {
      const userID = initUserID;
      const friendID = friend.id;

      const [found] = await db("user_friends").where({
        user_id: userID,
        friend_id: friendID,
      });
      const [found2] = await db("user_friends").where({
        user_id: friendID,
        friend_id: userID,
      });
      if (userID === friendID) {
        return "You can't be friends with yourself lol";
      } else if (!found || !found2) {
        await db("user_friends").insert({
          user_id: userID,
          friend_id: friendID,
        });

        await db("user_friends").insert({
          user_id: friendID,
          friend_id: userID,
        });

        return await db("user_friends");
      } else if (found || found2) {
        return "Already sharing information with this user";
      }
    } else {
      return "No user found for token provided.";
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteFriendship = async (id) => {
  await db("user_friends").where({ user_id: id }).del();
  return await db("user_friends").where({ friend_id: id }).del();
};

module.exports = {
  findUserFriends,
  addToFriendsTable,
  deleteFriendship,
};
