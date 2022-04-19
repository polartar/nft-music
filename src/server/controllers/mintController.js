const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");
const userController = require("./userController");
const axios = require("axios");
const mintList = require("../mintList.json");
const capsuleHouseList = require("../capsuleHouseList.json");

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
  console.log("MintController connected successfully to MongoDB");
}

setTimeout(() => {
  connectToDatabase();
}, 100);

async function getMintStatusForAddress(address) {
  try {
    // Check capsuleHouseList addresses array for address case insensitive match
    const capsuleHouseAddressMatch = capsuleHouseList.addresses.find(
      (capsuleHouseAddress) =>
        capsuleHouseAddress.toLowerCase() === address.toLowerCase()
    );

    if (capsuleHouseAddressMatch) {
      return {
        status: 200,
        response: "CAPSULE HOUSE",
      };
    }

    // Check mintList addresses array for address case insensitive match
    const addressMatch = mintList.addresses.find(
      (mintAddress) => mintAddress.toLowerCase() === address.toLowerCase()
    );

    if (addressMatch) {
      return {
        status: 200,
        response: "MINT LIST",
      };
    }

    return {
      status: 200,
      response: "PUBLIC",
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

module.exports = {
  getMintStatusForAddress,
};
