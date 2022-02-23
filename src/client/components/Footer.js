import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ShareModal from "./ShareModal";
import EmailModal from "./EmailModal";
import "../css/footer.css";
import { ethers, utils } from "ethers";

export default function Footer(props) {
  const { loggedIntoMetamaskOverride, showShare, shareURL } = props;
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

  const handleMintMenu = () => {
    console.log("clicked mint button");
    setShowMintMenu(!showMintMenu);
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
            Connected Address
          </div>
          <div className="bottomItem mobileLink" style={{ fontWeight: "700" }}>
            Sale Begins in
          </div>
          <button onClick={() => handleMintMenu()}>MINT</button>
        </div>
      ) : (
        <div
          className={
            props.white ? "bottomNav scrollBar white" : "bottomNav scrollBar"
          }
        >
          {showShare && !isLoggedIntoMetamask && (
            <div
              className="bottomItem mobileLink"
              onClick={() => setOpenShare(true)}
              style={{ fontWeight: "700" }}
            >
              SHARE
            </div>
          )}

          {showShare && isLoggedIntoMetamask && (
            <div
              className="bottomItem mobileLink"
              onClick={() => setOpenShare(true)}
              style={{ fontWeight: "700" }}
            >
              SHARE
            </div>
          )}

          <a href="https://discord.gg/ykrzXB9ZsV">
            <div className="bottomItem mobileLink">DISCORD</div>
          </a>
          <a href="https://twitter.com/SecretGarden_FM">
            <div className="bottomItem mobileLink">TWITTER</div>
          </a>
          <button onClick={() => handleMintMenu()}>MINT</button>
        </div>
      )}
    </React.Fragment>
  );
}
