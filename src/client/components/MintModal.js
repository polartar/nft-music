import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import copy from "copy-to-clipboard";
import {
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  FacebookMessengerShareButton,
} from "react-share";
import {
  FacebookMessengerIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
} from "react-share";
import X from "../images/x.png";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import AlbumArt from "../images/albumArt.png";
import InstaPic from "../images/instaPic.png";

import Telegram from "../images/telegram.png";
import Twitter from "../images/twitter.png";
import Messenger from "../images/messenger.png";
import CopyLink from "../images/link.png";
import Link from "../images/link.svg";
import ErrorLink from "../images/error-link.svg";

import LoadingFlower from "./LoadingFlower";

import "../css/bidModal.css";
import IconButton from "@material-ui/core/IconButton";
import { ethers, Contract, utils } from "ethers";
import * as Web3 from "web3";
import axios from "axios";
import { OpenSeaPort, Network } from "opensea-js";
import { WyvernSchemaName } from "opensea-js/lib/types";
import AuctionABI from "../constants/AuctionABI.json";
import { auctionAddress } from "../constants/config.json";
import Typography from "@material-ui/core/Typography";
import { parseEther } from "ethers/lib/utils";

const useStyles = makeStyles({
  dialog: {
    width: "680px",
    maxWidth: "100%",
    // transform: "scale(.8)",
    background: "#1f1f1f",
    // border: "1px solid #FFFFFF",
    borderRadius: "24px",
    margin: "20px",
    // boxShadow: "0 0 40px 20px rgba(255,255,255,0.12)",
  },
  backButton: {
    border: "solid 1px white",
    borderRadius: "0px",
    height: "41px",
    paddingLeft: "24px",
    paddingRight: "24px",
    color: "white",
    fontSize: "16px",
    backgroundColor: "#1f1f1f",
    textTransform: "none",
    fontWeight: "400",
  },
  continueButton: {
    border: "solid 1px white",
    borderRadius: "0px",
    height: "41px",
    paddingLeft: "24px",
    paddingRight: "24px",
    color: "#1f1f1f",
    fontSize: "16px",
    backgroundColor: "white",
    textTransform: "none",
    fontWeight: "400",
  },
  checkBox: {
    color: "white!important",
  },
  checkBoxText: {
    color: "white",
  },
});

export default function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, open, shareURL, tokenAddress, discountedPrice } = props;
  const [text, setText] = React.useState("Copy Link");
  const [metamaskAddress, setMetamaskAddress] = React.useState(null);
  const [transactionHash, setTransactionHash] = React.useState(
    "OX1892AKSD3981120030039"
  );

  const [isMinting, setIsMinting] = React.useState(false);
  const [didMint, setDidMint] = React.useState(false);
  const [currentPrice, setCurrentPrice] = useState();
  const [publicMinted, setPublicMinted] = useState(0);
  const [totalPublicMinted, setTotalPublicMinted] = useState(0);
  const [mintStatus, setMintStatus] = useState("");
  const [mintInfo, setMintInfo] = useState({
    whitelistMinted: 0,
    publicLimitPerWallet: 0,
    publicTotalLimit: 0,
  });
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);

  const priceDropAmount = "Public auction drops 0.0125 ETH every 15 minutes";
  const currentNFT = "Sunday Journal";
  // const discountedPrice = "0.0075";
  const capsulePrice = "0.2";

  const RoundUp = (intervalMilliseconds, datetime) => {
    datetime = datetime || new Date();
    var modTicks = datetime.getTime() % intervalMilliseconds;
    var delta = modTicks === 0 ? 0 : datetime.getTime() - modTicks;
    delta += intervalMilliseconds;
    return new Date(delta);
  };

  const nextPriceDropDate = RoundUp(
    15 * 60 * 1000,
    new Date()
  ).toLocaleTimeString();

  useEffect(() => {
    if (open) {
      setText("Copy Link");
    }
  }, [open]);

  useEffect(() => {
    if (window.ethereum) {
      async function init() {
        await checkNetwork();
        await window.ethereum.enable();

        const userAddress = window.ethereum.selectedAddress;
        if (userAddress) {
          setMetamaskAddress(userAddress);

          await createContractInstance();
        }
      }

      init();
    }
  }, []);

  useEffect(() => {
    if (!metamaskAddress) return;

    async function getStatus() {
      const mintStatusResponse = await axios.get(
        "/api/getMintStatusForAddress",
        {
          params: {
            address: metamaskAddress.toLowerCase(),
          },
        }
      );

      if (mintStatusResponse.status === 200) {
        setMintStatus(mintStatusResponse.data);
      }
    }

    getMintBalances();

    getStatus();
  }, [metamaskAddress]);

  useEffect(() => {
    if (!mintStatus) return;

    initializePrice();
  }, [mintStatus]);

  const getMintBalances = async () => {
    let instance = contract;
    if (!instance) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);

      instance = new Contract(auctionAddress, AuctionABI, signer);
    }

    const myPublicAmountMinted = await instance.getPublicMinted();
    const myWhitelistAmountMinted = await instance.getWhitelistMinted();
    const totalAmount = await instance.publicTotalMinted();
    const totalSupply = await instance.totalSupply();
    const whitelistAmount = await instance.getWhitelistMinted();
    const publicLimitPerWallet = await instance.publicListMaxMint();
    const publicTotalLimit = await instance.publicTotalMaxMint();

    setPublicMinted(
      myPublicAmountMinted.toNumber() + myWhitelistAmountMinted.toNumber()
    );
    setTotalPublicMinted(totalAmount.toNumber());
    setMintInfo({
      whitelistMinted: whitelistAmount,
      publicLimitPerWallet,
      publicTotalLimit,
    });
    setTotalSupply(totalSupply.toNumber());
  };

  const canMint = () => {
    return (
      publicMinted + mintInfo.whitelistMinted < mintInfo.publicLimitPerWallet &&
      totalPublicMinted < mintInfo.publicTotalLimit
    );
  };

  const initializePrice = async () => {
    let price;
    if (mintStatus === "PUBLIC") {
      if (!contract) return;
      price = await getCurrentMintPrice();

      setTimeout(initializePrice, 1000 * 30);
    } else if (mintStatus === "MINT LIST") {
      price = discountedPrice;
    } else if (mintStatus === "CAPSULE HOUSE") {
      price = capsulePrice;
    }

    setCurrentPrice(price);
  };

  const checkNetwork = async () => {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (currentChainId !== "0x1" && currentChainId !== "0x4") {
      switchNetwork("0x4");
    }
  };
  const switchNetwork = async (targetNetworkId) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetNetworkId }],
    });
    // refresh
    window.location.reload();
  };

  const getCurrentMintPrice = async () => {
    const cost = await contract.cost(1);
    return ethers.utils.formatEther(cost);
  };

  const handleMint = async () => {
    setIsMinting(true);
    try {
      let tx;
      if (mintStatus === "PUBLIC") {
        const price = await getCurrentMintPrice();
        tx = await contract.mintPublic(1, { value: parseEther(price) });
      } else if (mintStatus === "MINT LIST") {
        const signatureResponse = await axios.get(
          "/api/makeDiscountedSignature",
          {
            params: {
              address: metamaskAddress.toLowerCase(),
            },
          }
        );

        if (signatureResponse.status === 200) {
          tx = await contract.mintWhitelistDiscounted(
            signatureResponse.data.hash,
            signatureResponse.data.signature,
            1,
            { value: parseEther(discountedPrice) }
          );
        }
      } else if (mintStatus === "CAPSULE HOUSE") {
        tx = await contract.mintPublic(1, { value: capsulePrice });
      }

      setTransactionHash(tx.hash);
      await tx.wait();
      setPublicMinted(publicMinted + 1);
      setTotalPublicMinted(totalPublicMinted + 1);
      setDidMint(true);
    } catch (err) {
      console.log({ err });
    } finally {
      setIsMinting(false);
    }
  };

  const createContractInstance = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);

    const instance = new Contract(tokenAddress, AuctionABI, signer);

    setContract(instance);
  };

  const handleMetamask = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const address = window.ethereum.selectedAddress;

      checkNetwork();
      createContractInstance();

      setMetamaskAddress(address);
    }
  };

  const removeMetamask = () => {
    setMetamaskAddress(null);
  };

  // var path = anime.path('#loading-flower path');
  //

  return (
    <Dialog
      onClose={onClose}
      classes={{ paper: classes.dialog }}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className="mint-modal-container">
        <div className="modalHeader2" style={{ borderBottomWidth: "0px" }}>
          <div></div>
          <IconButton>
            <CloseIcon
              style={{ color: "#8F8F8A" }}
              fontSize="large"
              onClick={onClose}
            />
          </IconButton>
        </div>
        <div
          className="modalBody2"
          style={{ paddingTop: "0px", paddingBottom: "80px" }}
        >
          <div style={{ textAlign: "center" }}>
            {isMinting ? (
              <div className="display-small sm:display-medium white-text">
                Minting...
              </div>
            ) : (
              <div className="display-small sm:display-medium white-text">
                {didMint ? "Congrats!" : "Mint"}
              </div>
            )}
            {isMinting ? (
              <div>
                <p
                  className="body-medium white-text"
                  style={{ margin: "16px auto", maxWidth: "360px" }}
                >
                  Follow the on-screen dialogs for the wallet provider selected.
                  Approve or reject a transaction to finalize sale
                </p>
                <div id="loading-spinner" style={{ marginTop: "44px" }}>
                  {" "}
                  <LoadingFlower id="loading-flower" />
                </div>
              </div>
            ) : (
              <div style={{ paddingTop: "44px" }}>
                {didMint ? (
                  <p
                    className="body-medium sm:body-large white-text"
                    style={{ margin: "16px auto", maxWidth: "360px" }}
                  >
                    You succesfully purchased <b>{currentNFT}</b>
                  </p>
                ) : (
                  <React.Fragment>
                    {metamaskAddress ? (
                      <div>
                        <p className="body-medium sm:body-large white-text text-uppercase">
                          {metamaskAddress}
                        </p>
                        {/* <button
                          className="metamask-button disconnect"
                          onClick={removeMetamask}
                        >
                          <img src={ErrorLink} />
                          Disconnect Metamask
                        </button> */}
                      </div>
                    ) : (
                      <button
                        className="metamask-button body-large"
                        onClick={handleMetamask}
                      >
                        <img src={Link} />
                        Connect Metamask
                      </button>
                    )}
                  </React.Fragment>
                )}
                <div style={{ height: "44px" }} />

                {didMint ? (
                  <React.Fragment>
                    <button
                      className="cta-button"
                      onClick={handleMint}
                      disabled={
                        metamaskAddress && !isMinting && contract ? false : true
                      }
                    >
                      MINT - {currentPrice} ETH
                    </button>
                    <div style={{ height: "44px" }} />
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Mint Status: <b>{mintStatus}</b>
                    </p>
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Total Editions Minted: <b>{totalSupply}</b>
                    </p>
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Total Public Editions Minted: <b>{totalPublicMinted}</b>
                    </p>
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Next Price Drop: <b>{nextPriceDropDate}</b>{" "}
                    </p>
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Price Drop Amount: <b>{priceDropAmount}</b>{" "}
                    </p>
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Transaction Hash
                    </p>
                    <p className="body-medium sm:body-large yellow-text text-uppercase">
                      {transactionHash}
                    </p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {mintStatus !== "CAPSULE HOUSE" && metamaskAddress && (
                      <button
                        className="cta-button"
                        onClick={handleMint}
                        disabled={
                          metamaskAddress &&
                          !isMinting &&
                          contract &&
                          ((mintStatus === "PUBLIC" && canMint()) ||
                            mintStatus !== "PUBLIC")
                            ? false
                            : true
                        }
                      >
                        BUY NOW - {currentPrice} ETH
                      </button>
                    )}
                    <div style={{ height: "44px" }} />
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      <b>Limit 1 per wallet</b>
                    </p>
                    {metamaskAddress && (
                      <p className="body-medium yellowish-gray-text text-uppercase">
                        Mint Status: <b>{mintStatus}</b>
                      </p>
                    )}

                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Total Editions Minted: <b>{totalSupply}</b>
                    </p>
                    <p className="body-medium yellowish-gray-text text-uppercase">
                      Total Public Editions Minted: <b>{totalPublicMinted}</b>
                    </p>
                    {mintStatus === "PUBLIC" && (
                      <>
                        <p className="body-medium yellowish-gray-text text-uppercase">
                          Next Price Drop: <b>{nextPriceDropDate}</b>{" "}
                        </p>
                        <p className="body-medium yellowish-gray-text text-uppercase">
                          <b>{priceDropAmount}</b>
                        </p>
                      </>
                    )}
                    {mintStatus === "MINT LIST" && (
                      <>
                        <p className="body-medium yellowish-gray-text text-uppercase">
                          Mint List winners will always mint at 0.5 ETH.
                        </p>
                        <p className="body-medium yellowish-gray-text text-uppercase">
                          You will be able to claim a refund when sales end for
                          the difference between your price and the lowest Dutch
                          Auction price.
                        </p>
                      </>
                    )}
                    {mintStatus === "CAPSULE HOUSE" && (
                      <>
                        <p className="body-medium yellowish-gray-text text-uppercase">
                          You will be able to mint at 0.2 ETH on 4/21.
                        </p>
                      </>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
