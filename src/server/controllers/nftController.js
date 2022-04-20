const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.json");
const userController = require("./userController");
const axios = require("axios");

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
  console.log("NFTController connected successfully to MongoDB");
}

setTimeout(() => {
  connectToDatabase();
}, 100);

async function getNFTWithMetadata(nftID) {
  const nft = await db.collection("NFTs").findOne({
    _id: ObjectId(nftID),
  });

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

  return nft;
}

async function getFeaturedNFT() {
  try {
    const settings = await db.collection("settings").findOne({
      _id: ObjectId("605d225f34d1d94b02ef8591"),
    });

    const featuredNFT = await getNFTWithMetadata(settings.featuredNFTID);

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
    let nft = await db.collection("NFTs").findOne({
      artistName,
      name,
    });

    nft = await getNFTWithMetadata(nft._id.toString());

    return {
      status: 200,
      response: nft,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function getSequencerToken(tokenAddress, tokenId) {
  console.log(tokenAddress);
  try {
    let nft = await db.collection("NFTs").findOne({
      tokenAddress,
    });

    nft = await getNFTWithMetadata(nft._id.toString());

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
      let nft = await nftQuery.next();

      nft = await getNFTWithMetadata(nft._id.toString());
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
        headers: {
          "X-API-KEY": "e6de7b0f341949a1a3258887428c1ebc",
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

async function getNFTsForOwner(tokenAddress, ownerAddress, chain) {
  try {
    const nftIdResponse = await axios.get(
      `https://deep-index.moralis.io/api/v2/${ownerAddress}/nft/${tokenAddress}?chain=${chain}`,
      {
        headers: {
          "X-API-KEY":
            "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y",
        },
      }
    );

    console.log(nftIdResponse);
    console.log(tokenAddress);
    console.log(ownerAddress);
    console.log(chain);

    const nftIds = nftIdResponse.data.result.map((item) => item.token_id);

    const metadata = await db.collection("NFTs").findOne({
      tokenAddress,
    });

    if (!metadata) {
      throw new Error("No metadata found for token address");
    }

    const nfts = [];

    nftIds.forEach((nftId) => {
      const nft = { ...metadata };
      nft.tokenId = nftId;
      nfts.push(nft);
    });

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
  getNFTsForUser,
  getOrdersForNFT,
  getNFTsForOwner,
  getSequencerToken,
};
