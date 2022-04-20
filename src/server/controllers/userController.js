const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");
const { ethers, utils } = require("ethers");
const { useRadioGroup } = require("@material-ui/core");
const { soliditySha3 } = require("web3-utils");
const EthCrypto = require("eth-crypto");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const HASH_PREFIX_DISCOUNTED =
  "Leveling Up Heroes Epic Discounted Verification:";
// connect to our mongodb database
async function connectToDatabase() {
  let params = {};

  if (process.env.DATABASE_URL) {
    params = {
      useNewurlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsCAFile: "./ca-certificate.crt",
    };
  }
  const client = await MongoClient.connect(
    process.env.DATABASE_URL
      ? process.env.DATABASE_URL
      : "mongodb://localhost:27017",
    params
  );

  db = client.db("secretgarden");
  console.log("UserController connected successfully to MongoDB");
}

setTimeout(() => {
  connectToDatabase();
}, 100);

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
        { address: address.toLowerCase() },
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

async function addEmail(email) {
  try {
    console.log(email);
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!email.match(emailRegex)) {
      throw new Error("Please enter a valid email address.");
    }

    await db.collection("settings").updateOne(
      {
        _id: ObjectId("6076aa87edb6e954b38701f9"),
      },
      {
        $addToSet: { emails: email },
      }
    );

    return {
      status: 200,
      response: "Successfully added email!",
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function makeDiscountedSignature(address) {
  try {
    const discounthash = soliditySha3(HASH_PREFIX_DISCOUNTED, address);
    const ownerSignature = EthCrypto.sign(PRIVATE_KEY, discounthash);

    return {
      status: 200,
      response: {
        hash: discounthash,
        signature: ownerSignature,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

module.exports = {
  updateUser,
  getUser,
  getUsers,
  addEmail,
  makeDiscountedSignature,
};
