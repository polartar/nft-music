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
import { ethers, Contract, utils } from "ethers";
import * as Web3 from "web3";
import axios from "axios";
import { OpenSeaPort, Network } from "opensea-js";
import { WyvernSchemaName } from "opensea-js/lib/types";
import config from "../config.json";

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
  const { onClose, open, nft, didCompleteBid, currentBidAmount } = props;

  const startingBid = 0.01;

  const [seaport, setSeaport] = useState();
  const [wethConversionAmount, setWethConversionAmount] = useState(0);
  const [address, setAddress] = useState();
  const [wethBalance, setWethBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [bidCompleted, setBidCompleted] = useState(false);
  const [awaitingBidSignature, setAwaitingBidSignature] = useState(false);

  const initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const wethAddress = config.dev
      ? "0xc778417e063141139fce010982780140aa0cd5ab"
      : "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

    const contract = new Contract(
      wethAddress,
      [
        {
          constant: true,
          inputs: [
            {
              name: "_owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              name: "balance",
              type: "uint256",
            },
          ],
          payable: false,
          type: "function",
        },
      ],
      provider
    );

    setSeaport(
      new OpenSeaPort(window.ethereum, {
        networkName: config.dev ? Network.Rinkeby : Network.Main,
      })
    );

    setAddress(await signer.getAddress());
    setEthBalance(await provider.getBalance(address));
    setWethBalance(await contract.balanceOf(address));
  };

  useEffect(() => {
    initWallet();
  }, [open]);

  const convertETH = async () => {
    await seaport.wrapEth({
      amountInEth: bidAmount,
      accountAddress: address,
    });
    // Show loading screen here

    initWallet();
  };

  const placeBid = async () => {
    try {
      setAwaitingBidSignature(true);
      const offer = await seaport.createBuyOrder({
        asset: {
          tokenAddress: nft.tokenAddress,
          tokenId: nft.tokenId,
          schemaName: WyvernSchemaName.ERC1155,
        },
        accountAddress: address,
        startAmount: bidAmount,
      });
      setBidCompleted(true);
      setAwaitingBidSignature(false);
      didCompleteBid();
    } catch (error) {
      setAwaitingBidSignature(false);
    }
  };

  const goBack = () => {
    onClose();
    setTimeout(() => {
      setBidCompleted(false);
    }, 500);
  };

  const formattedWethBalance = parseFloat(utils.formatEther(wethBalance));
  const formattedEthBalance = parseFloat(utils.formatEther(ethBalance));

  const nextMinimumBid = currentBidAmount
    ? Math.min(currentBidAmount * 1.1, currentBidAmount + 0.1)
    : startingBid;

  const nextMinimumBidThreshold = nextMinimumBid.toPrecision(4) / 1;

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
        {!bidCompleted && (
          <div className="checkoutForm">
            <div className="yourBid">
              <div className="yourBid">YOUR BID</div>
              <div className="totalWallet">{`ETH Balance: ${`${formattedEthBalance.toPrecision(
                4
              ) / 1}`}`}</div>
              <div className="totalWallet">{`WETH Balance: ${`${formattedWethBalance.toPrecision(
                4
              ) / 1}`}`}</div>
            </div>
            <input
              type="number"
              step="any"
              onChange={(event) => setBidAmount(event.target.value)}
              className="ethInput"
              placeHolder={nextMinimumBidThreshold}
            />
            <div className="ethLabel">WETH</div>
            <div className="totalWallet minBid">{`Minimum Bid: ${nextMinimumBidThreshold}`}</div>
            {/* <div className="totalWallet minBid">This is an error message</div> */}
          </div>
        )}
        {bidCompleted && (
          <div className="congratsBidSection">
            <div className="congratsMessage">Congrats on placing your bid!</div>
            <div className="congratsAmount">{`Bid: ${bidAmount} WETH`}</div>
          </div>
        )}
        <div className="modalFooter">
          {!bidCompleted && (
            <React.Fragment>
              <Button
                variant="outlined"
                classes={{ root: classes.backButton }}
                onClick={onClose}
              >
                Cancel
              </Button>

              {bidAmount >= nextMinimumBidThreshold &&
                bidAmount > formattedWethBalance && (
                  <Button
                    variant="outlined"
                    classes={{ root: classes.continueButton }}
                    className="continueButton"
                    onClick={convertETH}
                  >
                    Convert to WETH
                  </Button>
                )}
              {bidAmount >= nextMinimumBidThreshold &&
                bidAmount <= formattedWethBalance && (
                  <Button
                    variant="outlined"
                    classes={{ root: classes.continueButton }}
                    className="continueButton"
                    onClick={placeBid}
                    disabled={awaitingBidSignature}
                  >
                    {awaitingBidSignature
                      ? "Waiting for Metamask signature..."
                      : "Place Bid"}
                  </Button>
                )}
            </React.Fragment>
          )}
          {bidCompleted && (
            <Button
              variant="outlined"
              classes={{ root: classes.continueButton }}
              className="continueButton"
              onClick={goBack}
            >
              Go Back
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
