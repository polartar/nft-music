import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AlbumArt from "../images/albumArt.png";
import InstaPic from "../images/instaPic.png";
import Wallet from "../images/wallet.png";
import WalletBlack from "../images/walletBlack.png";
import SecretGardenLogo from "../images/SecretGarden.png";
import SecretGardenBlack from "../images/SecretGardenBlack.png";
import "../css/navBar.css";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import anime from "animejs/lib/anime.es.js";
import MintModal from "./MintModal";

import Countdown, { zeroPad } from "react-countdown";
import Moralis from "moralis";

import { ethers, utils } from "ethers";
import Web3 from "web3";

// await Moralis.enableWeb3();
// const web3 = new Web3(Moralis.provider);

// const serverUrl = "https://7gfgogavdhta.usemoralis.com:2053/server";
// const appId = "ybcmRWIz6DQOVXEgyh4a8Jf7ENBZtX5lISlD320c";

// Moralis.start({ serverUrl, appId });

export default function Navbar(props) {
  const { white, loggedIntoMetamaskOverride, didConnectWallet } = props;

  const [address, setAddress] = useState();
  const [displayName, setDisplayName] = useState();
  const [provider, setProvider] = useState();
  const [balance, setBalance] = useState(0);
  const [isLoggedIntoMetamask, setIsLoggedIntoMetamask] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [nft, setNFT] = useState();
  const [showMintMenu, setShowMintMenu] = useState(false);
  const [openMint, setOpenMint] = useState(false);

  const refreshData = async () => {
    const nftResponse = await axios.get("/api/getFeaturedNFT");
    setNFT(nftResponse.data);
    setLoaded(true);
  };

  const initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.listAccounts();

    if (accounts.length > 0) {
      setIsLoggedIntoMetamask(true);
      setProvider(provider);

      const address = await provider.getSigner(0).getAddress();
      setAddress(address);
      setBalance(await provider.getBalance(address));

      const userResponse = await axios.get("/api/getUser", {
        params: {
          address
        }
      });

      if (userResponse.data.name) {
        setDisplayName(userResponse.data.name);
      } else {
        setDisplayName(address);
      }
    }
  };

  const connectWallet = async () => {
    await window.ethereum.enable();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const address = await provider.getSigner(0).getAddress();

    setIsLoggedIntoMetamask(true);
    setProvider(provider);
    setAddress(address);
    setBalance(await provider.getBalance(address));

    if (didConnectWallet) {
      didConnectWallet();
    }
  };

  useEffect(() => {
    initWallet();
  }, [loggedIntoMetamaskOverride]);

  const handleCloseMint = () => {
    setOpenMint(false);
  };

  useEffect(() => {
    refreshData();

    anime({
      targets: [".wordLogo"],
      easing: "easeInOutSine",
      duration: 1000,
      opacity: 1,
      delay: 1500
    });

    anime({
      targets: ["#mint-date"],
      easing: "easeInOutSine",
      duration: 1000,
      opacity: 0.7,
      delay: 2000
    });
  }, [loaded]);

  const nfts = [];

  // const fetchNftOwners = async () => {
  //   await Moralis.enableWeb3();
  //   const web3 = new Web3(Moralis.provider);

  //   const serverUrl = "https://7gfgogavdhta.usemoralis.com:2053/server";
  //   const appId = "ybcmRWIz6DQOVXEgyh4a8Jf7ENBZtX5lISlD320c";
  //   // Moralis.start({ serverUrl, appId });
  //   Moralis.start({
  //     masterKey:
  //       "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y"
  //   });

  //   const options = {
  //     address: "0xc782ab25dac76565d3fdede36fcf87227c9217da",
  //     chain: "eth"
  //   };
  //   const nftResponse = await Moralis.Web3API.token.getNFTOwners(options);
  //   nfts.concat(nftResponse.result);
  //   let qty = nftResponse.total;
  //   let tokenList = [];
  //   let nextPage = nftResponse.cursor;
  //   while (qty > 0) {
  //     const subsequentResponse = await Moralis.Web3API.token.getNFTOwners({
  //       ...options,
  //       cursor: nextPage
  //     });
  //     nfts.push.apply(nfts, subsequentResponse.result);
  //     nextPage = subsequentResponse.cursor;
  //     qty -= 500;
  //   }
  //   console.log(
  //     "nfts: ",
  //     // nfts
  //     nfts.filter(token => token.token_id === "1924")
  //   );
  // };

  const wait = ms => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

  const fetchNftOwners = async () => {
    console.log("nft: ", nft);
    const nftResponse = await axios.get(
      // `https://deep-index.moralis.io/api/v2/nft/${nft.tokenAddress}/${nft.tokenId}/owners?chain=eth&format=decimal`,
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
    console.log("nftResponse: ", nftResponse);
    nfts.push.apply(nfts, nftResponse.data.result);
    let qty = nftResponse.data.total;
    let tokenList = [];
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
                // "QL0Tp07l7YwtzRIsFOMqhQmjVCmcS3skO8Rsbo0y7OZYTaBBTaEr6fNRBcVtXMfn",
                "ak4ClPYq259ou7IVWWx1OmFr5xDHrzWHk9A3cwgpM1gXB0TBjZRHN7s8ViUZGQ4y"
            }
          }
        )
        .then(subsequentResponse => {
          nfts.push.apply(nfts, subsequentResponse.data.result);
          nextPage = subsequentResponse.data.cursor;
          qty -= 500;
        })
        .then(await wait(1000));
    }
    // console.log(
    //   "nfts: ",
    //   // nfts
    //   nfts.filter(
    //     token => token.owner_of === "0x0aa0925f7ded722eb35c789a4e0101926414d23b"
    //   )
    // );
    return nfts;
  };

  const getMix = async (address, tokenId) => {
    // const signature = await this.state.signer.signMessage(address);

    const response = await axios.get("/api/getMix", {
      address,
      tokenId
      // signature,
    });

    console.log("response from api fetch: ", response);
  };

  return (
    <React.Fragment>
      {loaded && (
        <React.Fragment>
          <div
            className={white ? "navBar scrollBar white" : "navBar scrollBar"}
          >
            <a href="/" className="wordLogo">
              {/*<img
                src={white ? SecretGardenBlack : SecretGardenLogo}
                className="logo"
              />
              */}
              Secret Garden
            </a>
            <div
              style={{
                display: "Flex",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div
                className="body-medium yellow-text"
                id="mint-date"
                onClick={() => getMix()}
              >
                MINTING APRIL 2022
              </div>
              <div
                className="metamask-button"
                onClick={() => setOpenMint(true)}
                style={{ fontWeight: "700" }}
              >
                ACCESS PRE-SALE
              </div>
            </div>

            <MintModal onClose={handleCloseMint} open={openMint} />

            {/* <div className={white ? "timer white" : "timer"}>
              <Countdown
                date={nft.bidEndDate}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return <div className="time">Auction Completed</div>;
                  } else {
                    return (
                      <React.Fragment>
                        <div className="time">{`${zeroPad(
                          days * 24 + hours
                        )}:${zeroPad(minutes)}:${zeroPad(seconds)}`}</div>
                        <div className="nextText">
                          remaining for current auction
                        </div>
                      </React.Fragment>
                    );
                  }
                }}
              />
            </div> */}

            {/* {!isLoggedIntoMetamask && (
              <div onClick={connectWallet} className="walletText">
                CONNECT WALLET
              </div>
            )} */}

            {isLoggedIntoMetamask && (
              <div className="signedInWrapper">
                <div className="walletOuter">
                  <img src={white ? WalletBlack : Wallet} className="wallet" />
                  <span className="walletAmount">{`${parseFloat(
                    utils.formatEther(balance)
                  ).toFixed(4)} ETH`}</span>
                </div>
                <a href="/profile">
                  <div className="userName">{displayName}</div>
                </a>
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
