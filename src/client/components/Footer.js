import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import ShareModal from "./ShareModal";
import "../css/footer.css";
import { ethers, utils } from "ethers";

export default function Footer(props) {
  const { loggedIntoMetamaskOverride, showShare, shareURL } = props;
  const [loaded, setLoaded] = useState(false);
  const [address, setAddress] = useState();
  const [openShare, setOpenShare] = useState();
  const [isLoggedIntoMetamask, setIsLoggedIntoMetamask] = useState(false);

  const refreshData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const address = await provider.getSigner().getAddress();

    if (accounts.length > 0) {
      setIsLoggedIntoMetamask(true);
      setAddress(address);
    }
  };
  const handleClose = () => {
    setOpenShare(false);
  };
  useEffect(() => {
    refreshData();
  }, [loaded, loggedIntoMetamaskOverride]);

  return (
    <React.Fragment>
      <ShareModal shareURL={shareURL} onClose={handleClose} open={openShare} />
      <div
        className={
          props.white ? "bottomNav scrollBar white" : "bottomNav scrollBar"
        }
      >
        <a href="/">
          <div className="bottomItem mobileLink">LIVE AUCTION</div>
        </a>
        {showShare && !isLoggedIntoMetamask && (
          <div
            className="bottomItem mobileLink"
            onClick={() => setOpenShare(true)}
            style={{ fontWeight: "700" }}
          >
            SHARE
          </div>
        )}
        <a href="/directory">
          <div className="bottomItem mobileLink">DIRECTORY</div>
        </a>
        {showShare && isLoggedIntoMetamask && (
          <div
            className="bottomItem mobileLink"
            onClick={() => setOpenShare(true)}
            style={{ fontWeight: "700" }}
          >
            SHARE
          </div>
        )}

        {isLoggedIntoMetamask && (
          <a href={`/collection/${address}`} className="notMobileLink">
            <div className="bottomItem">MY COLLECTION</div>
          </a>
        )}
        {isLoggedIntoMetamask && (
          <a href={`/profile`} className=" notMobileLink">
            <div className="bottomItem">PROFILE</div>
          </a>
        )}
      </div>
    </React.Fragment>
  );
}
