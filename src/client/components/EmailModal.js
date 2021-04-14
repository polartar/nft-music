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
import AlbumArt from "../images/albumArt.png";
import InstaPic from "../images/instaPic.png";

import Telegram from "../images/telegram.png";
import Twitter from "../images/twitter.png";
import Messenger from "../images/messenger.png";
import CopyLink from "../images/link.png";

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
    transform: "scale(.8)",
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
  const [email, setEmail] = React.useState();
  const [feedback, setFeedback] = React.useState();

  const addEmail = async () => {
    try {
      const response = await axios.post("/api/addEmail", {
        email,
      });

      setFeedback(
        "Thanks for subscribing! We'll keep you in the loop about future drops."
      );
    } catch (error) {
      if (error.response) {
        setFeedback(error.response.data);
      }
    }
  };
  return (
    <Dialog
      onClose={onClose}
      classes={{ paper: classes.dialog }}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className="modalHeader2">
        <div className="modalTitle">Stroll through the Secret Garden</div>
        <IconButton>
          <img src={X} className="x" onClick={onClose} />
        </IconButton>
      </div>
      <div className="modalBody2">
        <div className="modalTitle">Subscribe to hear about future drops</div>
        <input
          onBlur={(event) => setEmail(event.target.value)}
          className="ethInput emailInput"
          placeHolder={"Enter Email"}
        />
      </div>
      <div style={{ color: "white" }}>{feedback}</div>
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
          onClick={addEmail}
        >
          Subscribe
        </Button>
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
