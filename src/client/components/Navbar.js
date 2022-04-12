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
import anime from 'animejs/lib/anime.es.js';
import MintModal from "./MintModal";

import Countdown, { zeroPad } from "react-countdown";

import { ethers, utils } from "ethers";

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


  useEffect(() => {
    refreshData();

    anime({
      targets: ['.wordLogo'],
      easing: 'easeInOutSine',
      duration: 1000,
      opacity:1,
      delay: 1500,
    });

    anime({
      targets: ['#mint-date'],
      easing: 'easeInOutSine',
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
            <a href="/"  className="wordLogo">
              {/*<img
                src={white ? SecretGardenBlack : SecretGardenLogo}
                className="logo"
              />
              */}

                Secret Garden

            </a>
            <div style={{display:"Flex", gap:"12px", justifyContent:"center", alignItems:"center"}}>
              <div className="body-medium yellow-text" id="mint-date">MINTING APRIL 2022</div>
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
