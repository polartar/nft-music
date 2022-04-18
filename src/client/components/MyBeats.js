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
import "../css/directory.css";

import axios from "axios";
import { ethers, utils } from "ethers";

function Collection(props) {
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIntoMetamask, setIsLoggedIntoMetamask] = useState(false);
  const [nfts, setNFTs] = useState([]);
  const [displayName, setDisplayName] = useState();

  const refreshData = async () => {
    let userAddress;
    if (window.ethereum) {
      userAddress = window.ethereum.selectedAddress;
    }

    if (userAddress) {
      const nftsResponse = await axios.get("/api/getNFTsForOwner", {
        params: {
          collection: props.match.params.address,
          owner: userAddress,
          chain: "rinkeby",
        },
      });

      setNFTs(nftsResponse.data);
      const userResponse = await axios.get("/api/getUser", {
        params: {
          address: userAddress,
        },
      });

      if (userResponse.data.name) {
        setDisplayName(userResponse.data.name);
      } else {
        setDisplayName(props.match.params.address);
      }
      setIsLoggedIntoMetamask(true);
    }

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const accounts = await provider.listAccounts();

    // if (accounts.length > 0) {
    //   setIsLoggedIntoMetamask(true);
    // }

    setLoaded(true);
  };

  useEffect(() => {
    refreshData();
  }, [loaded]);

  return (
    <React.StrictMode>
      {loaded && (
        <div className="containerDirectory scrollBar">
          <Navbar white={true} didConnectWallet={refreshData} />
          <div className="directoryBody">
            <div className="currentAuctionTitle">{`${displayName}'s Collection`}</div>
            {nfts.length === 0 && (
              <div className="currentAuctionTitle">
                This user currently has no stem packs in their collection.
              </div>
            )}
            {nfts.length > 0 &&
              nfts.map((nft) => {
                const mediaFileExtension = nft.imageURL
                  .split(".")
                  .pop()
                  .toLowerCase();
                return (
                  <a href={`/${nft.artistName}/${nft.name}/${nft.edition}`}>
                    <div className="beatPackItem">
                      {mediaFileExtension === "mp4" && (
                        <video
                          width="300"
                          height="300"
                          playsinline="true"
                          autoplay="true"
                          muted="true"
                          loop="true"
                          style={{ marginBottom: "20px" }}
                        >
                          <source src={nft.imageURL} type="video/mp4" />
                        </video>
                      )}
                      {mediaFileExtension !== "mp4" && (
                        <img src={nft.imageURL} className="directoryAlbum" />
                      )}
                      <div className="directoryItemName">{nft.name}</div>
                      <div className="directoryArtistName">
                        {nft.artistName}
                      </div>
                      <div className="editionSold">
                        <div className="editionSoldText">{`Edition: #${nft.edition}`}</div>
                      </div>
                      {/* <div className="editionSold boughtFor">
                        <div className="editionSoldText">{`Bought for: ${nft.saleAmount?.toFixed(
                          2
                        )} ETH`}</div>
                      </div> */}
                    </div>
                  </a>
                );
              })}
          </div>

          <Footer
            white={true}
            loggedIntoMetamaskOverride={isLoggedIntoMetamask}
          />
        </div>
      )}
    </React.StrictMode>
  );
}

export default Collection;
