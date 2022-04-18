/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef, useState, useEffect } from "react";
import cx from "classnames";

// import Canvas from './Canvas';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import SecretGardenLogo from "../images/SecretGarden.png";
import Loading from "../images/loading.gif";
import "../css/settings.css";

import axios from "axios";
import { ethers, utils } from "ethers";

function OpaqueLoadingScreen() {
  return (
    <React.StrictMode>
      <div className="opaqueLoadingScreen scrollBar">
        {/* <Navbar white={false} didConnectWallet={refreshData} /> */}
        <img src={Loading} />
        {/* <Footer white={false} /> */}
      </div>
    </React.StrictMode>
  );
}

export default OpaqueLoadingScreen;
