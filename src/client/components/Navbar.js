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
import HamburgerMenuButton from "./HamburgerMenuButton";

import "../css/navBar.css";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import anime from "animejs/lib/anime.es.js";
import MintModal from "./MintModal";
import MenuModal from "./MenuModal";

import Countdown, { zeroPad } from "react-countdown";
import Moralis from "moralis";

import { ethers, utils } from "ethers";
import Web3 from "web3";

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
  const [openMenu, setOpenMenu] = useState(false);

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
          address,
        },
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

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  useEffect(() => {
    refreshData();

    anime({
      targets: [".wordLogo"],
      easing: "easeInOutSine",
      duration: 1000,
      opacity: 1,
      delay: 1500,
    });

    anime({
      targets: ["#mint-date"],
      easing: "easeInOutSine",
      duration: 1000,
      opacity: 0.7,
      delay: 2000,
    });

    anime({
      targets: [".wallet-container"],
      easing: "easeInOutSine",
      duration: 1000,
      opacity: 0.7,
      delay: 2000,
    });
  }, [loaded]);

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
            {/*<div className="body-medium yellow-text" id="mint-date">MINTING APRIL 2022</div>*/}

            <MintModal
              onClose={handleCloseMint}
              open={openMint}
              discountedPrice={nft.discountedPrice.toString()}
              tokenAddress={nft.tokenAddress}
            />
            <MenuModal
              onClose={handleCloseMenu}
              open={openMenu}
              didConnectWallet={didConnectWallet}
              loggedIntoMetamaskOverride={loggedIntoMetamaskOverride}
              isLoggedIntoMetamask={isLoggedIntoMetamask}
              connectWallet={connectWallet}
              balance={balance}
              displayName={displayName}
            />

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
            <div className="wallet-container">
              {!isLoggedIntoMetamask && (
                <button
                  onClick={connectWallet}
                  id="wallet-button"
                  className={
                    white
                      ? "metamask-button small dark"
                      : "metamask-button small"
                  }
                >
                  CONNECT WALLET
                </button>
              )}

              {isLoggedIntoMetamask && (
                <div id="signedInWrapper" className="signedInWrapper">
                  <div className="walletOuter">
                    <img
                      src={white ? WalletBlack : Wallet}
                      className="wallet"
                    />
                    <span className="walletAmount">{`${parseFloat(
                      utils.formatEther(balance)
                    ).toFixed(4)} ETH`}</span>
                  </div>
                  <a href="/profile">
                    <div className="userName">{displayName}</div>
                  </a>
                </div>
              )}
              {nft && nft.showMintButton && (
                <button
                  id="mint-button"
                  className={
                    white ? "cta-button small dark" : "cta-button small"
                  }
                  onClick={() => setOpenMint(true)}
                >
                  MINT
                </button>
              )}
              <HamburgerMenuButton
                onClick={() => setOpenMenu(true)}
                className={
                  white ? "metamask-button small dark" : "metamask-button small"
                }
                stroke={white ? "#353535" : "#E4F0A8"}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
