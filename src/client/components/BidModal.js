import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import X from "../images/x.png";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import AlbumArt from "../images/albumArt.png";
import InstaPic from "../images/instaPic.png";
import "../css/bidModal.css";
import IconButton from "@material-ui/core/IconButton";
import { ethers } from "ethers";
import * as Web3 from "web3";
import axios from "axios";
import { OpenSeaPort, Network } from "opensea-js";
import { WyvernSchemaName } from "opensea-js/lib/types";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  dialog: {
    width: "494px",
    maxWidth: "100%",
    background: "#1f1f1f",
    border: "1px solid #FFFFFF",
    boxShadow: "0 0 40px 20px rgba(255,255,255,0.12)",
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
});

export default function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, open, nft } = props;
  const DEV = true;

  const [seaport, setSeaport] = useState();
  const [wethConversionAmount, setWethConversionAmount] = useState(0);
  const [address, setAddress] = useState();
  const [wethBalance, setWethBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);

  const initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    setSeaport(
      new OpenSeaPort(window.ethereum, {
        networkName: DEV ? Network.Rinkeby : Network.Main,
      })
    );

    setAddress(await this.signer.getAddress());
  };

  useEffect(() => {
    setSeaport(
      new OpenSeaPort(window.ethereum, {
        networkName: DEV ? Network.Rinkeby : Network.Main,
      })
    );
  }, [open]);

  const convertETH = async () => {
    const wrapTx = await this.seaport.wrapEth({
      amountInEth: 0.001,
      accountAddress: this.address,
    });
  };

  return (
    <Dialog
      onClose={onClose}
      classes={{ paper: classes.dialog }}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className="modalHeader">
        <div className="modalTitle">Make an Offer</div>
        <IconButton>
          <img src={X} className="x" onClick={onClose} />
        </IconButton>
      </div>
      <div className="modalBody">
        <div className="beatWrapper">
          <img src={nft.imageURL} className="checkoutArt" />
          <div className="beatInfoCheckout">
            <div className="beatCheckoutName">{nft.name}</div>
            <div className="beatArtist">{nft.artist.name}</div>
          </div>
        </div>
        <div className="checkoutForm">
          <div className="yourBid">
            <div className="yourBid">YOUR BID</div>
            <div className="totalWallet">Balance: 25.6984</div>
          </div>
          <input className="ethInput" placeHolder="0.00" />
          <div className="ethLabel">ETH</div>
        </div>
        {/* <div className="congratsBidSection">
          <div className="congratsMessage">Congrats on placing your bid!</div>
          <div className="congratsAmount">Bid: 10.2543 WETH</div>
        </div> */}
        <div className="modalFooter">
          <Button
            variant="outlined"
            classes={{ root: classes.backButton }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            classes={{ root: classes.continueButton }}
            className="continueButton"
          >
            Transfer to WETH
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
