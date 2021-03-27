/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef, useState, useEffect } from "react";
import cx from "classnames";

// import Canvas from './Canvas';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import SecretGardenLogo from "../images/SecretGarden.png";
import AlbumArt from "../images/albumArt.png";
import InstaPic from "../images/instaPic.png";
import Wallet from "../images/wallet.png";
import Expand from "../images/expand.png";
import ExpandMore from "../images/expandMore.png";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/settings.css";

import axios from "axios";
import { ethers, utils } from "ethers";

function Settings() {
  const [expand, setExpand] = useState(false);

  const [address, setAddress] = useState();
  const [signer, setSigner] = useState();
  const [isLoggedIntoMetamask, setIsLoggedIntoMetamask] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [displayName, setDisplayName] = useState();
  const [email, setEmail] = useState();
  const [feedback, setFeedback] = useState("");

  const refreshData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setSigner(provider.getSigner());

    const accounts = await provider.listAccounts();
    const address = await provider.getSigner().getAddress();

    if (accounts.length > 0) {
      setIsLoggedIntoMetamask(true);
      setAddress(address);
    }

    const userResponse = await axios.get("/api/getUser", {
      params: {
        address,
      },
    });

    if (userResponse.data.name) {
      setDisplayName(userResponse.data.name);
      setEmail(userResponse.data.email);
    } else {
      setDisplayName(address);
    }
  };

  useEffect(() => {
    refreshData();
  }, [loaded]);

  const updateUser = async () => {
    try {
      const signature = await signer.signMessage(address);

      const response = await axios.post("/api/updateUser", {
        address,
        signature,
        displayName,
        email,
      });

      setFeedback("Successfully updated your profile!");
    } catch (error) {
      if (error.response) {
        setFeedback(error.response.data);
      }
    }
  };

  return (
    <React.StrictMode>
      <div className="containerSettings scrollBar">
        <Navbar white={false} didConnectWallet={refreshData} />
        {isLoggedIntoMetamask && (
          <div className="settingsBody">
            <div className="settingsTitle">SETTINGS</div>
            <div className="settingsItem">
              <div className="settingsItemTitle">Display Name</div>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="settingsInput"
              />
            </div>
            <div className="settingsItem">
              <div className="settingsItemTitle">Email</div>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="settingsInput"
              />
            </div>
            <div className="settingsItem">
              <Button onClick={updateUser} className="updateButton">
                Update
              </Button>
            </div>
            {feedback}
          </div>
        )}
        {!isLoggedIntoMetamask && (
          <div className="settingsBody">Please connect your wallet</div>
        )}
        <Footer white={false} />
      </div>
    </React.StrictMode>
  );
}

export default Settings;
