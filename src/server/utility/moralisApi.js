const axios = require("axios");

const wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const fetchTokenOwners = async (tokenAddress, tokenId) => {
  let tokenList = [];
  const nftResponse = await axios.get(
    `https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}/owners?chain=eth&format=decimal`,
    {
      headers: {
        accept: "application/json",
        "X-API-Key":
          "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y"
      }
    }
  );
  tokenList.push.apply(tokenList, nftResponse.data.result);
  let qty = nftResponse.data.total;
  let nextPage = nftResponse.data.cursor;
  while (qty > 0) {
    console.log("nextPage: ", nextPage);
    const subsequentResponse = await axios
      .get(
        `https://deep-index.moralis.io/api/v2/nft/${nft.tokenAddress}/${nft.tokenId}/owners?chain=eth&format=decimal&cursor=${nextPage}`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key":
              "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y"
          }
        }
      )
      .then(subsequentResponse => {
        tokenList.push.apply(tokenList, subsequentResponse.data.result);
        nextPage = subsequentResponse.data.cursor;
        qty -= 500;
      })
      .then(await wait(1000));
  }
  return tokenList;
};

const fetchOwnerNfts = async (ownerAddress, tokenAddress) => {
  const nftIdResponse = await axios.get(
    `https://deep-index.moralis.io/api/v2/${ownerAddress}/nft/${tokenAddress}`,
    {
      headers: {
        "X-API-KEY":
          "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y"
      }
    }
  );

  const nftIds = nftIdResponse.data.result.map(item => item.token_id);

  console.log("nftIds: ", nftIds);

  const metadata = await db.collection("NFTs").findOne({
    tokenAddress
  });

  if (!metadata) {
    throw new Error("No metadata found for token address");
  }

  const nfts = [];

  nftIds.forEach(nftId => {
    const nft = { ...metadata };
    nft.tokenId = nftId;
    nfts.push(nft);
  });

  return nfts;
};

module.exports = {
  fetchTokenOwners,
  fetchOwnerNfts
};
