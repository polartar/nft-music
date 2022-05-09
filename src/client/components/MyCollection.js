/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef, useState, useEffect } from "react";
import cx from "classnames";

// import Canvas from './Canvas';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import SecretGardenLogo from "../images/SecretGarden.png";
import AlbumArt from "../images/albumArt.png";
import InstaPic from "../images/instaPic.png";
import Wallet from "../images/wallet.png";
import Expand from "../images/expand.png";
import ExpandMore from "../images/expandMore.png";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/directory.scss";

import axios from "axios";
import { ethers, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

function MyCollection(props) {
  const [nfts, setNFTs] = useState([]);
  const { account, active, chainId } = useWeb3React();

  const refreshData = async () => {
      const nftsResponse = await axios.get("/api/getAllNFTsForUser", {
      params: {
        address: account,
        chain: chainId === 1 ? "eth" : "rinkeby"
      }
    });
console.log(nftsResponse.data)
    setNFTs(nftsResponse.data);
    const userResponse = await axios.get("/api/getUser", {
      params: {
        address: account
      }
    });

    // if (userResponse.data.name) {
    //   setDisplayName(userResponse.data.name);
    // } else {
    //   setDisplayName(props.match.params.address);
    // }
  };

  useEffect(() => {
    if (account) {
      refreshData();
    }
  }, [account]);

  return (
    <React.StrictMode>
        <div className="containerDirectory scrollBar dark-background">
          <Navbar white={false} isConnected = {active} />
          {
            active && 
            <div className="directoryBody no-flex">
              {Object.keys(nfts).length === 0 && (
                <div className="currentAuctionTitle yellowish-gray-text">
                  This user currently has no stem packs in their collection.
                </div>
              )}
              {Object.keys(nfts).length > 0 &&
                Object.keys(nfts).map(tokenAddress => {
                  const myNFTs = nfts[tokenAddress];
                  return (
                    <div key={tokenAddress}>
                      <h3>Collection Name: {myNFTs[0]?.name}</h3>
                      <div className="nfts">
                        {
                          myNFTs.map(nft => {
                            const mediaFileExtension = nft.imageURL
                              .split(".")
                              .pop()
                              .toLowerCase();
                            return (
                              <a
                                href={`/bouquet/${nft.artistName}/${nft.name}/${nft.tokenId}`}
                                key={nft.tokenId + nft.imageURL}
                              >
                                <div className="beatPackItem">
                                  {mediaFileExtension === "mp4" && (
                                    <video
                                      width="300"
                                      height="300"
                                      playsInline={true}
                                      autoPlay={true}
                                      muted={true}
                                      loop={true}
                                      style={{ marginBottom: "20px" }}
                                    >
                                      <source src={nft.imageURL} type="video/mp4" />
                                    </video>
                                  )}
                                  {mediaFileExtension !== "mp4" && (
                                    <img src={nft.imageURL} className="directoryAlbum" />
                                  )}
                                  <div className="directoryItemName white-text display-small">{nft.name}</div>
                                  <div className="directoryArtistName light-yellow-text body-medium">
                                    {nft.artistName}
                                  </div>
                                  <div className="editionSold">
                                    <div className="editionSoldText yellowish-gray-text">{`Edition: #${nft.tokenId}`}</div>
                                  </div>
                                </div>
                              </a>
                            );
                          })
                        }
                      </div>
                    </div>
                  )
                  
                })
              }
            </div>
          }
        </div>
    </React.StrictMode>
  );
}

export default MyCollection;
