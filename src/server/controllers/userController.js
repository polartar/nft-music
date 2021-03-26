const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");
const { ethers, utils } = require("ethers");

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
      address,
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

async function updateUser(address, signature, name, email) {
  try {
    const verifiedAddress = utils.verifyMessage(address, signature);

    if (verifiedAddress && verifiedAddress === address) {
      await db.collection("users").updateOne(
        { address },
        {
          $set: {
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

async function getNFTsForUser(address) {}

module.exports = {
  updateUser,
  getUser,
};
