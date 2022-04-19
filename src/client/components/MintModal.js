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
import CloseIcon from '@mui/icons-material/Close';
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
  const { onClose, open, shareURL } = props;
  const [text, setText] = React.useState("Copy Link");
  const [metamaskAddress, setMetamaskAddress] = React.useState(null);
  const [transactionHash, setTransactionHash] = React.useState("OX1892AKSD3981120030039");

  const [isMinting, setIsMinting] = React.useState(false);
  const [didMint, setDidMint] = React.useState(false);

  const mintPrice = 0.5;
  const editionsMinted = 0.5;
  const nextPriceDropDate = "4/12";
  const priceDropAmount = 0.1;
  const currentNFT = "Sunday Journal";

  useEffect(() => {
    if (open) {
      setText("Copy Link");
    }
    if (window.ethereum) {
      checkNetwork();
      const userAddress = window.ethereum.selectedAddress;
      if (userAddress) {
        setMetamaskAddress(userAddress);
      }
    }


  }, [open]);
  const checkNetwork = async () => {
    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    if (currentChainId !== '0x1' && currentChainId !== '0x4') {
      switchNetwork('0x4');
    }
  }
  const switchNetwork = async (targetNetworkId) => {
    console.log({targetNetworkId})
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetNetworkId }],
    });
    // refresh
    window.location.reload();
  };

  const handleMint = async () => {
    setIsMinting(true)
    try {
      const mintStatus = await axios.get("/api/getMintStatusForAddress", {
        params: {
          address: metamaskAddress.toLowerCase(),
        },
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      
      const contract = new Contract(auctionAddress, AuctionABI, signer);
      
      if (mintStatus.data === 'PUBLIC') {
        await contract.mintPublic(1, {value: parseEther("5")});
      } else if (mintStatus.data === 'MINT LIST') {
        const signatureResponse = await axios.get("/api/makeDiscountedSignature", {
          params: {
            address: metamaskAddress,
          },
        });  
        
        if (signatureResponse.status === 200) {
          await contract.mintWhitelistDiscounted(signatureResponse.data.hash, signatureResponse.data.signature, 1, {value: parseEther("0.75")});
        }
      } else if (mintStatus.data === 'CAPSULE HOUSE') {
        await contract.mintPublic(1, {value: parseEther("0.2")});
      }
    } catch (err) {
      console.log({err})
    } finally {
      setIsMinting(false)
    }
  }

  const handleMetamask = async() => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const address = window.ethereum.selectedAddress;

      checkNetwork();

      setMetamaskAddress(address)
    }
  }

  const removeMetamask = () => {
    setMetamaskAddress(null)
  }

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
      <div className="modalHeader2" style={{borderBottomWidth:"0px"}}>
        <div></div>
        <IconButton>
          <CloseIcon style={{color:"#8F8F8A"}} fontSize="large"  onClick={onClose}/>
        </IconButton>
      </div>
      <div className="modalBody2" style={{paddingTop:"0px", paddingBottom:"80px"}}>
        <div style={{textAlign:"center"}}>
          {isMinting ?
            <div className="display-small sm:display-medium white-text">Minting...</div>
            :
            <div className="display-small sm:display-medium white-text">{didMint ? "Congrats!" : "Access Pre-Sale"}</div>
          }
            {
              isMinting ?
              <div>
                <p className="body-medium white-text" style={{margin:"16px auto", maxWidth:"360px"}}>Follow the on-screen dialogs for the wallet provider selected. Approve or reject a transaction to finalize sale</p>
                <div id="loading-spinner" style={{marginTop:"44px"}}> <LoadingFlower id="loading-flower"/></div>
              </div>

              :
              <div style={{paddingTop:"44px"}}>
                {
                  didMint ?
                  <p className="body-medium sm:body-large white-text" style={{margin:"16px auto", maxWidth:"360px"}}>You succesfully purchased <b>{currentNFT}</b></p>
                  :
                  <React.Fragment>
                    {
                      metamaskAddress ?
                      <div>
                        <p className="body-medium sm:body-large white-text text-uppercase">{metamaskAddress}</p>
                        <button className="metamask-button disconnect" onClick={removeMetamask}><img src={ErrorLink} />Disconnect Metamask</button>
                      </div>
                      :
                      <button className="metamask-button body-large" onClick={handleMetamask}><img src={Link} />Connect Metamask</button>
                    }
                  </React.Fragment>
                }
                <div style={{height:"44px"}}/>

                {
                    didMint ?
                    <React.Fragment>
                      <p className="body-medium yellowish-gray-text text-uppercase">Transaction Hash</p>
                      <p className="body-medium sm:body-large yellow-text text-uppercase">{transactionHash}</p>
                    </React.Fragment>
                  :
                  <React.Fragment>
                    <button className="cta-button" onClick={handleMint} disabled={(metamaskAddress && !isMinting) ? false : true}>BUY NOW - {mintPrice}ETH</button>
                    <div style={{height:"44px"}}/>
                    <p className="body-medium yellowish-gray-text text-uppercase">Total Editions Minted: <b>{editionsMinted}</b></p>
                    <p className="body-medium yellowish-gray-text text-uppercase">Next Price Drop: <b>{nextPriceDropDate}</b> </p>
                    <p className="body-medium yellowish-gray-text text-uppercase">Price Drop Aount: <b>{priceDropAmount}</b> </p>
                  </React.Fragment>
                }

              </div>
          }
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
