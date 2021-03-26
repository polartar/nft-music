/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef } from "react";
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
import "../css/directory.css";

class Sequencer extends Component {
  state = { expand: false };

  constructor(props) {
    super(props);
  }

  expandToggle = () => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  render() {
    return (
      <React.StrictMode>
        <div className="containerDirectory scrollBar">
          <Navbar white={true} />
          <div className="directoryBody">
            <div className="currentAuctionTitle">MY BEAT PACKS</div>
            {/* <div className="currentAuctionTitle">
              You currently have no Beat Packs
            </div> */}
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Edition: 01/100</div>
              </div>
              <div className="editionSold boughtFor">
                <div className="editionSoldText">Bought for: 1.0832 ETH</div>
              </div>
            </div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Edition: 01/100</div>
              </div>
              <div className="editionSold boughtFor">
                <div className="editionSoldText">Bought for: 1.0832 ETH</div>
              </div>
            </div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Edition: 01/100</div>
              </div>
              <div className="editionSold boughtFor">
                <div className="editionSoldText">Bought for: 1.0832 ETH</div>
              </div>
            </div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Edition: 01/100</div>
              </div>
              <div className="editionSold boughtFor">
                <div className="editionSoldText">Bought for: 1.0832 ETH</div>
              </div>
            </div>
          </div>

          <Footer white={true} />
        </div>
      </React.StrictMode>
    );
  }
}

export default Sequencer;
