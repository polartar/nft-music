const axios = require("axios");

const wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const fetchTokenOwners = async (tokenAddress, tokenId) => {
  let tokenList = [];
  const nftResponse = await axios.get(
    // `https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}/owners?chain=eth&format=decimal`,
    "https://deep-index.moralis.io/api/v2/nft/0x40875223d61a688954263892d0f76c94fd6b3d4a/1/owners?chain=eth&format=decimal",
    {
      headers: {
        accept: "application/json",
        "X-API-Key":
          // "QL0Tp07l7YwtzRIsFOMqhQmjVCmcS3skO8Rsbo0y7OZYTaBBTaEr6fNRBcVtXMfn"
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
        // `https://deep-index.moralis.io/api/v2/nft/${nft.tokenAddress}/${nft.tokenId}/owners?chain=eth&format=decimal&cursor=${nextPage}`,
        `https://deep-index.moralis.io/api/v2/nft/0x40875223d61a688954263892d0f76c94fd6b3d4a/1/owners?chain=eth&format=decimal&cursor=${nextPage}`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key":
              "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y"
            // "QL0Tp07l7YwtzRIsFOMqhQmjVCmcS3skO8Rsbo0y7OZYTaBBTaEr6fNRBcVtXMfn",
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
    `https://deep-index.moralis.io/api/v2/0x518e354ca7419b5c9b4d13090321fc9a03e036d5/nft/0x40875223d61a688954263892d0f76c94fd6b3d4a`,
    {
      headers: {
        "X-API-KEY":
          "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y"
      }
    }
  );

  const nftIds = nftIdResponse.data.result.map(item => item.token_id);

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

  return {
    status: 200,
    response: nfts
  };
};

module.exports = {
  fetchTokenOwners,
  fetchOwnerNfts
};
