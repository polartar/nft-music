const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");
const userController = require("./userController");
const axios = require("axios");

// Create a new MongoClient
const client = new MongoClient(config.mongoDBURL);
let db;

client.connect(function(err) {
  console.log("NFTController connected successfully to MongoDB");

  db = client.db(config.mongoDBName);
});

async function getFeaturedNFT() {
  try {
    const settings = await db.collection("settings").findOne({
      _id: ObjectId("605d225f34d1d94b02ef8591"),
    });

    const featuredNFT = await db.collection("NFTs").findOne({
      _id: ObjectId(settings.featuredNFTID),
    });

    const artist = await db.collection("artists").findOne({
      name: featuredNFT.artistName,
    });

    featuredNFT.artist = artist;

    return {
      status: 200,
      response: featuredNFT,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function getNFT(artistName, name, edition) {
  try {
    const nft = await db.collection("NFTs").findOne({
      artistName,
      name,
      edition: parseFloat(edition),
    });

    const artist = await db.collection("artists").findOne({
      name: artistName,
    });

    nft.artist = artist;

    return {
      status: 200,
      response: nft,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function getAllNFTs() {
  try {
    const nftQuery = await db.collection("NFTs").find();

    const nfts = [];

    while (await nftQuery.hasNext()) {
      const nft = await nftQuery.next();

      const artist = await db.collection("artists").findOne({
        name: nft.artistName,
      });

      nft.artist = artist;

      if (nft.ownerAddress) {
        const { response } = await userController.getUser(nft.ownerAddress);
        if (response) {
          nft.ownerName = response.name;
        }
      }
      nfts.push(nft);
    }

    return {
      status: 200,
      response: nfts,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function getNFTsForUser(address) {
  try {
    const nftQuery = await db.collection("NFTs").find({
      ownerAddress: address.toLowerCase(),
    });

    const nfts = [];
    while (await nftQuery.hasNext()) {
      const nft = await nftQuery.next();

      nfts.push(nft);
    }

    return {
      status: 200,
      response: nfts,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function getOrdersForNFT(nftID, useTestnet) {
  try {
    const nft = await db.collection("NFTs").findOne({
      _id: ObjectId(nftID),
    });

    const orderResponse = await axios.get(
      useTestnet
        ? "https://rinkeby-api.opensea.io/wyvern/v1/orders/"
        : "https://api.opensea.io/wyvern/v1/orders",
      {
        params: {
          asset_contract_address: nft.tokenAddress,
          token_id: nft.tokenId,
          limit: 50,
          side: 0,
          order_by: "eth_price",
          order_direction: "desc",
        },
      }
    );

    return {
      status: 200,
      response: orderResponse.data,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

module.exports = {
  getNFT,
  getFeaturedNFT,
  getAllNFTs,
  getNFTsForUser,
  getOrdersForNFT,
};
