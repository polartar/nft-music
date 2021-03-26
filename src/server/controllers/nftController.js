const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");

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

module.exports = {
  getNFT,
  getFeaturedNFT,
  getAllNFTs,
};
