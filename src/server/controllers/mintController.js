const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");
const userController = require("./userController");
const axios = require("axios");
const mintList = require("../mintList.json");
const capsuleHouseList = require("../capsuleHouseList.json");
const { soliditySha3 } = require("web3-utils");
const HASH_PREFIX_DISCOUNTED = "Sunday Journal Discounted Verification:";
const HASH_PREFIX_WHITELISTED = "Sunday Journal Base Verification:";
const EthCrypto = require("eth-crypto");
const { parseEther } = require("ethers/lib/utils");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const {PRIVATE_KEY} = require("../private.json")

const GENESIS_PRICE = "0.05";
const EARLY_PRICE = "0.065";
const PUBLIC_PRICE = "0.1";
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
    const mintStatus = await db
      .collection("mintStatus")
      .findOne({ address: address.toLowerCase() });
    let price;

    if (mintStatus?.status === "GENESIS") {
      price = GENESIS_PRICE;
    }

    if (mintStatus?.status === "CAPSULE HOUSE") {
      price = EARLY_PRICE;
    }

    if (mintStatus) {
      return {
        status: 200,
        response: {
          status: mintStatus.status,
          price,
        },
      };
    }

    return {
      status: 200,
      response: {
        status: "PUBLIC",
        price: PUBLIC_PRICE,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function getMetadata(address, tokenId) {
  try {
    tokenId = tokenId.toString();

    const metadata = await db.collection("NFTs").findOne({
      tokenAddress: address.toLowerCase(),
    });

    const baseURL = process.env.BASE_URL
      ? process.env.BASE_URL
      : "localhost:3001";

    const formattedMetadata = {
      name: `${metadata.name} #${tokenId}`,
      description: metadata.description,
      external_url: `https://${baseURL}/bouquet/${metadata.artistName}/${metadata.name}/${tokenId}`,
      animation_url: `https://${baseURL}/bouquetEmbed/${address.toLowerCase()}/${tokenId}`,
      image: metadata.thumbnail,
      attributes: [
        {
          trait_type: "Music Artist",
          value: metadata.artistName,
        },
        {
          trait_type: "Visual Artist",
          value: metadata.visualArtistName,
        },
        {
          trait_type: "Beats Per Minute",
          value: metadata.bpm,
        },
        {
          trait_type: "Key",
          value: metadata.key,
        },
      ],
    };

    return { status: 200, response: formattedMetadata };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function makeDiscountedSignature(address) {
  const mintStatus = await getMintStatusForAddress(address);
  if (mintStatus.response.status !== "CAPSULE HOUSE") {
    return { status: 400, response: "invalid user" };
  }
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

async function makeWhitelistSignature(address, quantity) {
  const mintStatus = await getMintStatusForAddress(address);

  if (mintStatus.response.status !== "GENESIS") {
    return { status: 400, response: "invalid user" };
  }

  const price = mintStatus.response.price;
  try {
    // const hash = soliditySha3(HASH_PREFIX_WHITELISTED, address);
    const hash = soliditySha3(address, parseEther(price), quantity);
    const ownerSignature = EthCrypto.sign(PRIVATE_KEY, hash);

    return {
      status: 200,
      response: {
        hash: hash,
        signature: ownerSignature,
        price,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

module.exports = {
  getMintStatusForAddress,
  getMetadata,
  makeDiscountedSignature,
  makeWhitelistSignature,
};
