const { MongoClient } = require("mongodb");
const config = require("../config.json");

// Create a new MongoClient
const client = new MongoClient(config.mongoDBURL);
let db;

client.connect(function(err) {
  console.log("NFTController connected successfully to MongoDB");

  db = client.db(config.mongoDBName);
});

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

module.exports = {
  getNFT,
};
