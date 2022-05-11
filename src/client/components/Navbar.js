import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, Box, Typography } from "@material-ui/core";
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

import { useWeb3React } from "@web3-react/core";
import { injectedConnector, walletconnect } from "../connectors";
import useSWR from "swr";
import { fetcher } from "../utilities";
import WalletconnectIcon from "../images/walletconnect.png";
import ERC20ABI from "../utilities/ERC20ABI.json";

const useStyles = makeStyles({
  button: {
    width: "100%",
    marginTop: "10px !important",
    background: "#6655f1",
    color: "white",
    height: "50px",
  },
  buttonConnect: {
    background: "#6655f1",
    color: "white",
    margin: "0 10px",
  },
  icon: {
    width: "40px",
    position: "absolute",
    left: "20px",
  },
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  background: "white",
  color: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Navbar(props) {
  const classes = useStyles();
  const { white, loggedIntoMetamaskOverride, isConnected } = props;
  const {
    chainId,
    account,
    active,
    activate,
    deactivate,
    library,
  } = useWeb3React();
  const [open, setOpen] = useState(false);
  const { data: balance, mutate } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library, ERC20ABI),
  });
  const [displayName, setDisplayName] = useState();
  const [loaded, setLoaded] = useState(false);
  const [nft, setNFT] = useState();
  const [openMint, setOpenMint] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (!active && !isConnected) connectWallet();
  }, [active, isConnected]);

  useEffect(() => {
    library?.on("block", () => {
      mutate(undefined, true);
    });
    return () => {
      library?.removeAllListeners("block");
    };
  }, [library, mutate]);

  useEffect(() => {
    if (!active) return;

    async function getUser() {
      const userResponse = await axios.get("/api/getUser", {
        params: {
          address: account,
        },
      });

      if (userResponse.data.name) {
        setDisplayName(userResponse.data.name);
      } else {
        setDisplayName(account);
      }
    }

    getUser();
  }, [account]);

  useEffect(() => {
    if (chainId && chainId !== 4 && chainId !== 1) {
      switchNetwork("0x4");
    }
  }, [account, chainId, deactivate]);

  const switchNetwork = async (targetNetworkId) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetNetworkId }],
    });
    // refresh
    window.location.reload();
  };

  const connectWallet = () => {
    setOpen(true);
  };
  const onConnectMetaMask = () => {
    activate(injectedConnector);
    handleClose();
  };
  const onConnectWalletConnect = () => {
    activate(walletconnect);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const refreshData = async () => {
    const nftResponse = await axios.get("/api/getFeaturedNFT");
    setNFT(nftResponse.data);
    setLoaded(true);
  };

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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Button
                variant="contained"
                className={classes.button}
                onClick={onConnectMetaMask}
              >
                <img
                  className={classes.icon}
                  src="https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg"
                  alt="metamask"
                />
                Connect MetaMask
              </Button>
              <Button
                variant="contained"
                className={classes.button}
                onClick={onConnectWalletConnect}
              >
                <img
                  className={classes.icon}
                  src={WalletconnectIcon}
                  alt="walletconnect"
                />
                Connect WalletConnect
              </Button>
            </Box>
          </Modal>
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
              onConnect={setOpen}
              discountedPrice={nft.discountedPrice?.toString()}
              tokenAddress={nft.tokenAddress}
            />
            <MenuModal
              onClose={handleCloseMenu}
              open={openMenu}
              didConnectWallet={active}
              loggedIntoMetamaskOverride={active}
              isLoggedIntoMetamask={active}
              connectWallet={connectWallet}
              balance={balance}
              displayName={displayName}
              tokenAddress={nft.tokenAddress}
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
              {active ? (
                <div id="signedInWrapper" className="signedInWrapper">
                  <div className="walletOuter">
                    <img
                      src={white ? WalletBlack : Wallet}
                      className="wallet"
                    />
                    <span className="walletAmount">{`${
                      balance
                        ? parseFloat(utils.formatEther(balance)).toFixed(4)
                        : 0
                    } ETH`}</span>
                  </div>
                  <a href={`/collection/`}>
                    <div className="userName">{displayName}</div>
                  </a>
                </div>
              ) : (
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
