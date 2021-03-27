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
import Countdown, { zeroPad } from "react-countdown";
import { ethers, utils } from "ethers";

function Directory() {
  const [expand, setExpand] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [featuredNFT, setFeaturedNFT] = useState({});
  const [nfts, setNFTs] = useState([]);
  const [isLoggedIntoMetamask, setIsLoggedIntoMetamask] = useState(false);

  const expandToggle = (key) => {
    const updatedExpand = { ...expand };

    updatedExpand[key] = !updatedExpand[key];
    setExpand(updatedExpand);
  };

  const refreshData = async () => {
    const featuredNFTResponse = await axios.get("/api/getFeaturedNFT");
    const allNFTsResponse = await axios.get("/api/getAllNFTs");

    setFeaturedNFT(featuredNFTResponse.data);
    setNFTs(allNFTsResponse.data);

    setLoaded(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    if (accounts.length > 0) {
      setIsLoggedIntoMetamask(true);
    }
  };

  useEffect(() => {
    refreshData();
  }, [loaded]);

  const featuredNFTEditions = nfts.filter(
    (nft) =>
      nft.name === featuredNFT.name && nft.artistName === featuredNFT.artistName
  );

  const pastNFTs = {};

  nfts.map((nft) => {
    if (
      nft.name !== featuredNFT.name ||
      nft.artistName !== featuredNFT.artistName
    ) {
      const key = nft.name + nft.artistName;
      if (!pastNFTs[key]) {
        pastNFTs[key] = {
          name: nft.name,
          artistName: nft.artistName,
          imageURL: nft.imageURL,
          editions: [],
        };
      }

      pastNFTs[key].editions.push(nft);
    }
  });

  return (
    <React.StrictMode>
      {loaded && (
        <div className="containerDirectory scrollBar">
          <Navbar white={true} didConnectWallet={refreshData} />
          <div className="directoryBody">
            <div className="currentAuctionWrapper">
              <div className="currentAuctionTitle">CURRENT AUCTION</div>
              <div className="topPanelWrapper">
                <div className="currentAuctionInfo">
                  <a href="/">
                    <img
                      src={featuredNFT.imageURL}
                      className="currentAuctionPic"
                    />
                  </a>
                  <div className="currentAuctionDetailsWrapper">
                    <a href="/">
                      <div className="currentAuctionPack">
                        {featuredNFT.name}
                      </div>
                    </a>
                    <a href="/">
                      <div className="currentAuctionArtist">
                        {featuredNFT.artistName}
                      </div>
                    </a>
                    <div className="auctionExtraInfo">
                      <div className="currentAuctionInfoItem">
                        <div className="currentAuctionInfoItemTitle">
                          TIME LEFT
                        </div>
                        <div className="currentAuctionInfoItemText">
                          <Countdown
                            date={featuredNFT.bidEndDate}
                            renderer={({
                              days,
                              hours,
                              minutes,
                              seconds,
                              completed,
                            }) => {
                              if (completed) {
                                return (
                                  <div className="bidInfo">
                                    Auction Completed
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="bidInfo">{`${days} days, 
                              ${hours} hrs, ${minutes} mins, ${seconds} secs`}</div>
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="currentAuctionInfoItem"
                        style={{ marginLeft: "40px" }}
                      >
                        <div className="currentAuctionInfoItemTitle">
                          EDITION
                        </div>
                        <div className="currentAuctionInfoItemText">
                          {featuredNFT.edition}
                        </div>
                      </div>
                    </div>

                    <div className="editionSection  scrollBar ">
                      <div className="currentAuctionEditionTitle">EDITIONS</div>
                      {featuredNFTEditions.map((nft) => {
                        return (
                          <a
                            href={`/${nft.artistName}/${nft.name}/${nft.edition}`}
                          >
                            <div className="bidItemDirectory">
                              <div className="editionInfoDirectory scrollBar current">
                                <div className="editionNumber">{`${nft.edition}.`}</div>
                                <div className="editionOwner">
                                  {nft.ownerName
                                    ? nft.ownerName
                                    : "Currently bidding"}
                                </div>
                              </div>
                              {nft.saleAmount && (
                                <div className="editionPriceDirectory">
                                  {nft.saleAmount}
                                </div>
                              )}
                              {!nft.saleAmount && (
                                <div className="editionPriceDirectory">
                                  <Countdown
                                    date={nft.bidEndDate}
                                    renderer={({
                                      days,
                                      hours,
                                      minutes,
                                      seconds,
                                      completed,
                                    }) => {
                                      if (completed) {
                                        return <div>Auction Completed</div>;
                                      } else {
                                        return (
                                          <React.Fragment>
                                            <div>{`${zeroPad(
                                              days * 24 + hours
                                            )}:${zeroPad(minutes)}:${zeroPad(
                                              seconds
                                            )}`}</div>
                                          </React.Fragment>
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="artistSummary scrollBar">
                  {featuredNFT.artist ? featuredNFT.artist.description : null}
                </div>
              </div>
            </div>
            <div className="currentAuctionTitle">PAST AUCTIONS</div>
            {Object.keys(pastNFTs).map((key) => {
              const name = pastNFTs[key].name;
              const artistName = pastNFTs[key].artistName;
              const imageURL = pastNFTs[key].imageURL;
              const editions = pastNFTs[key].editions;
              return (
                <div className="beatPackItem">
                  <img src={imageURL} className="directoryAlbum" />
                  <div className="directoryItemName">{name}</div>
                  <div className="directoryArtistName">{artistName}</div>
                  <div className="editionSold">
                    <div className="editionSoldText">Editions</div>
                    <IconButton onClick={() => expandToggle(key)}>
                      <img
                        src={ExpandMore}
                        className={
                          expand ? "expandMore expandLess" : "expandMore"
                        }
                      />
                    </IconButton>
                  </div>
                  {expand[key] && (
                    <React.Fragment>
                      {editions.map((nft) => {
                        return (
                          <a href={`/${artistName}/${name}/${nft.edition}`}>
                            <div className="bidItemDirectory">
                              <div className="editionInfoDirectory scrollBar current">
                                <div className="editionNumber">{`${nft.edition}.`}</div>
                                <div className="editionOwner">
                                  {nft.ownerName
                                    ? nft.ownerName
                                    : "Currently bidding"}
                                </div>
                              </div>
                              {nft.saleAmount && (
                                <div className="editionPriceDirectory">
                                  {`${nft.saleAmount.toFixed(2)} ETH`}
                                </div>
                              )}
                              {!nft.saleAmount && (
                                <div className="editionPriceDirectory">
                                  <Countdown
                                    date={nft.bidEndDate}
                                    renderer={({
                                      days,
                                      hours,
                                      minutes,
                                      seconds,
                                      completed,
                                    }) => {
                                      if (completed) {
                                        return <div>Auction Completed</div>;
                                      } else {
                                        return (
                                          <React.Fragment>
                                            <div>{`${zeroPad(
                                              days * 24 + hours
                                            )}:${zeroPad(minutes)}:${zeroPad(
                                              seconds
                                            )}`}</div>
                                          </React.Fragment>
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </React.Fragment>
                  )}
                </div>
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

export default Directory;
