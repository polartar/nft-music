import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";

import ShareModal from "./ShareModal";
import EmailModal from "./EmailModal";
import "../css/footer.css";
import { ethers, utils } from "ethers";
import { ThemeProvider } from "@material-ui/styles";

import PlayCircleIcon from "../images/PlayCircleIcon.svg";
import ShuffleCircleIcon from "../images/ShuffleCircleIcon.svg";
import StopCircleIcon from "../images/StopCircleIcon.svg";

import Discord from "../images/discord.svg";
import Twitter from "../images/Twitter.svg";
import Instagram from "../images/Instagram.svg";

import Share from "../images/Share.svg";
import ControlsButton from "./ControlsButton";

export default function Footer(props) {
  const {
    loggedIntoMetamaskOverride,
    showShare,
    shareURL,
    setVolume,
    volume,
    muiTheme,
    clearSelections,
    canvas,
    playing,
    handleShuffle,
    playMix,
    setOpenControls,
    openControls,
  } = props;
  const [loaded, setLoaded] = useState(false);
  const [address, setAddress] = useState();
  const [openShare, setOpenShare] = useState(false);

  const [openEmail, setOpenEmail] = useState(false);
  const [isLoggedIntoMetamask, setIsLoggedIntoMetamask] = useState(false);
  const [showMintMenu, setShowMintMenu] = useState(false);

  const refreshData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const address = await provider.getSigner(0).getAddress();

    if (accounts.length > 0) {
      setIsLoggedIntoMetamask(true);
      setAddress(address);
    }
  };
  const handleClose = () => {
    setOpenShare(false);
  };
  const handleClickOpenEmail = () => {
    setOpenEmail(true);
  };

  const handleCloseEmail = () => {
    setOpenEmail(false);
  };

  useEffect(() => {
    refreshData();
  }, [loaded, loggedIntoMetamaskOverride]);

  return (
    <React.Fragment>
      <ShareModal shareURL={shareURL} onClose={handleClose} open={openShare} />
      <EmailModal onClose={handleCloseEmail} open={openEmail} />

      {/* <a href="/directory">
                <div className="bottomItem mobileLink">DIRECTORY</div>
              </a> */}
      {/* {isLoggedIntoMetamask && (
                <a href={`/collection/${address}`} className="notMobileLink">
                  <div className="bottomItem">MY COLLECTION</div>
                </a>
              )} */}
      {/*
              <div onClick={handleClickOpenEmail} className="bottomItem mobileLink">
                FUTURE DROPS
              </div> */}
      {/* {isLoggedIntoMetamask && (
                <a href={`/profile`} className=" notMobileLink">
                  <div className="bottomItem">PROFILE</div>
                </a>
              )} */}
      {showMintMenu ? (
        <div
          className={
            props.white ? "bottomNav scrollBar white" : "bottomNav scrollBar"
          }
        >
          <div className="bottomItem mobileLink" style={{ fontWeight: "700" }}>
            CONNECTED ADDRESS
          </div>
          <div className="bottomItem mobileLink" style={{ fontWeight: "700" }}>
            SALE BEGINS IN
          </div>
          <div className="bottomItem mobileLink" style={{ fontWeight: "700" }}>
            XX ETH
          </div>
          <button className="button" onClick={() => handleMintMenu()}>
            MINT
          </button>
        </div>
      ) : (
        <div
          className={
            props.white ? "bottomNav scrollBar white" : "bottomNav scrollBar"
          }
        >
          {/* {showShare && !isLoggedIntoMetamask && ( */}
          <div className="play-controls">
            <div className="stopBtnContainer">
              <div className="stopBtnWrapper">
                {playing ? (
                  <span
                    style={{ display: "flex", gap: "8px", marginRight: "8px" }}
                  >
                    <a href="#" onClick={clearSelections}>
                      <img src={StopCircleIcon} style={{ height: "35px" }} />
                    </a>
                    {/* <a href="#" onClick={handleShuffle}>
                      <img src={ShuffleCircleIcon} style={{ height: "35px" }} />
                    </a> */}
                  </span>
                ) : (
                  <a href="#" onClick={playMix}>
                    <img
                      src={PlayCircleIcon}
                      style={{ height: "35px", marginRight: "8px" }}
                    />
                  </a>
                )}
              </div>
            </div>

            <div className="volumeContainer">
              <div className="volumeWrapper">
                <ThemeProvider theme={muiTheme}>
                  <Slider
                    min={-50}
                    max={0}
                    defaultValue={volume}
                    onChange={(event, newValue) => setVolume(newValue)}
                  />
                </ThemeProvider>
              </div>
            </div>
          </div>

          {/* )} */}

          {/* {showShare && isLoggedIntoMetamask && (
          <div
            className="bottomItem mobileLink"
            onClick={() => setOpenShare(true)}
            style={{ fontWeight: "700" }}
          >
            SHARE
          </div>
          )} */}
          {showShare && (
            <div style={{ display: "flex", gap: "16px", marginRight: "16px" }}>
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
          )}
          <div>
            <ControlsButton
              className=""
              onClick={setOpenControls}
              fill={openControls ? "#FFF" : "#575757"}
            />
          </div>

          {/* <button className="button" onClick={() => handleMintMenu()}>
            TO MINT MENU
          </button> */}
        </div>
      )}
    </React.Fragment>
  );
}
