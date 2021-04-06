const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");
const { ethers, utils } = require("ethers");
const { useRadioGroup } = require("@material-ui/core");

// Create a new MongoClient
const client = new MongoClient(config.mongoDBURL);
let db;

client.connect(function(err) {
  console.log("UserController connected successfully to MongoDB");

  db = client.db(config.mongoDBName);
});

async function getUser(address) {
  try {
    const user = await db.collection("users").findOne({
      address: address.toLowerCase(),
    });

    return {
      status: 200,
      response: user,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function getUsers(addresses) {
  try {
    const userQuery = await db.collection("users").find({
      address: { $in: addresses ? addresses : [] },
    });

    const users = {};
    while (await userQuery.hasNext()) {
      const user = await userQuery.next();
      users[user.address] = user;
    }

    return {
      status: 200,
      response: users,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function updateUser(address, signature, name, email) {
  try {
    const verifiedAddress = utils.verifyMessage(address, signature);

    if (verifiedAddress && verifiedAddress === address) {
      const nameCheck = await db.collection("users").findOne({
        name,
      });

      const emailCheck = await db.collection("users").findOne({
        email,
      });

      if (nameCheck && nameCheck.address !== address.toLowerCase()) {
        throw new Error("This name is already in use.");
      }

      if (emailCheck && emailCheck.address !== address.toLowerCase()) {
        throw new Error("This email is already in use.");
      }

      await db.collection("users").updateOne(
        { address },
        {
          $set: {
            address: address.toLowerCase(),
            name,
            email,
          },
        },
        { upsert: true }
      );

      return {
        status: 200,
        response: "Successfully updated user!",
      };
    }

    throw new Error("Signature does not match!");
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

module.exports = {
  updateUser,
  getUser,
  getUsers,
};
