import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";

import "../css/footer.css";
import { ethers, utils } from "ethers";

export default function Footer(props) {
  const { loggedIntoMetamaskOverride } = props;
  const [loaded, setLoaded] = useState(false);
  const [address, setAddress] = useState();
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

  useEffect(() => {
    refreshData();
  }, [loaded, loggedIntoMetamaskOverride]);

  return (
    <React.Fragment>
      <div
        className={
          props.white ? "bottomNav scrollBar white" : "bottomNav scrollBar"
        }
      >
        <a href="/">
          <div className="bottomItem mobileLink">LIVE AUCTION</div>
        </a>
        <a href="/directory">
          <div className="bottomItem mobileLink">DIRECTORY</div>
        </a>
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
