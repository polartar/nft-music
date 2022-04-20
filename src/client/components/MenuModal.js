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
import Wallet from "../images/wallet.png";

import Telegram from "../images/telegram.png";
import Messenger from "../images/messenger.png";
import CopyLink from "../images/link.png";
import Link from "../images/link.svg";
import ErrorLink from "../images/error-link.svg";

import "../css/bidModal.css";
import IconButton from "@material-ui/core/IconButton";
import { ethers, Contract, utils } from "ethers";
import * as Web3 from "web3";
import axios from "axios";
import { OpenSeaPort, Network } from "opensea-js";
import { WyvernSchemaName } from "opensea-js/lib/types";

import Typography from "@material-ui/core/Typography";

import Discord from "../images/discord.svg";
import Twitter from "../images/Twitter.svg";
import Instagram from "../images/Instagram.svg";
import Share from "../images/Share.svg";

import ShareModal from "./ShareModal";

const isMobile = window.innerWidth <= 414;

const useStyles = makeStyles({
  dialog: {
    width: "350px",
    maxWidth: "100%",
    // transform: "scale(.8)",
    background: "#1f1f1f",
    // border: "1px solid #FFFFFF",
    borderRadius: "24px",
    margin: "20px",
    top: 0,
    right: 0,
    position: isMobile ? "static" : "absolute",
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
  const {
    onClose,
    open,
    shareURL,
    loggedIntoMetamaskOverride,
    isLoggedIntoMetamask,
    didConnectWallet,
    connectWallet,
    balance,
    displayName,
    tokenAddress,
  } = props;

  const [openShare, setOpenShare] = useState(false);

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  return (
    <Dialog
      onClose={onClose}
      classes={{ paper: classes.dialog }}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <ShareModal
        shareURL={shareURL}
        onClose={handleCloseShare}
        open={openShare}
      />

      <div className="menu-modal-container">
        <div className="menu-modal-header" style={{ borderBottomWidth: "0px" }}>
          <div></div>
          <IconButton>
            <CloseIcon
              style={{ color: "#8F8F8A" }}
              fontSize="large"
              onClick={onClose}
            />
          </IconButton>
        </div>
        <div className="menu-modal-body">
          <div style={{ textAlign: "center" }}>
            {!isLoggedIntoMetamask && (
              <button onClick={connectWallet} className="metamask-button">
                CONNECT WALLET
              </button>
            )}

            {isLoggedIntoMetamask && (
              <React.Fragment>
                <p className="body-large white-text">
                  <a href={`/collection/${tokenAddress}`}>My Collection</a>
                </p>
                <div className="walletOuter">
                  <img src={Wallet} className="wallet" />
                  <span className="walletAmount">{`${parseFloat(
                    utils.formatEther(balance)
                  ).toFixed(4)} ETH`}</span>
                </div>
                <br />
                <a href="/profile">
                  <div className="userName">{displayName}</div>
                </a>
              </React.Fragment>
            )}
            <br />
            <br />
            <div style={{ display: "inline-flex", gap: "16px" }}>
              {/* <a href="https://discord.gg/ykrzXB9ZsV">
              <div className=""><img src={Discord}/></div>
            </a> */}
              <a href="https://twitter.com/SecretGarden_FM">
                <div className="">
                  <img src={Twitter} />
                </div>
              </a>
              <a href="https://instagram.com/SecretGarden_FM">
                <div className="">
                  <img src={Instagram} />
                </div>
              </a>
              <div
                className=""
                onClick={() => setOpenShare(true)}
                style={{ fontWeight: "700" }}
              >
                <img src={Share} />
              </div>
            </div>
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
