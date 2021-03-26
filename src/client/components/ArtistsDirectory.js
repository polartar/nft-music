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
import Spotify from "../images/spotify.png";
import Instagram from "../images/instagram.png";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/artistsDirectory.css";

class Sequencer extends Component {
  state = { artist: false };

  constructor(props) {
    super(props);
  }

  //   expandToggle = () => {
  //     this.setState({
  //       artist: !this.state.expand,
  //     });
  //   };

  render() {
    return (
      <React.StrictMode>
        <div className="containerDirectoryArtist scrollBar">
          <Navbar white={true} />
          {!this.state.artist && (
            <div className="artistDirectoryBody">
              <div className="artistTitleDirectory">ARTISTS</div>
              <div className="artistDirectoryWrapper">
                <img src={InstaPic} className="artistDirectoryImg" />
                <div className="artistDirectoryInfoWrapper">
                  <div className="artistDirectoryName">Crusty Cuts</div>
                  <div className="artistDirectoryHandle">@crustcuts</div>
                  <div className="artistDirectoryNumPacks">3 beat packs</div>
                </div>
              </div>
              <div className="artistDirectoryWrapper">
                <img src={InstaPic} className="artistDirectoryImg" />
                <div className="artistDirectoryInfoWrapper">
                  <div className="artistDirectoryName">Crusty Cuts</div>
                  <div className="artistDirectoryHandle">@crustcuts</div>
                  <div className="artistDirectoryNumPacks">3 beat packs</div>
                </div>
              </div>
            </div>
          )}
          {this.state.artist && (
            <div className="artistBioBody">
              <div className="left">
                <div className="artistDirectoryWrapper">
                  <img src={InstaPic} className="artistDirectoryImg" />
                  <div className="artistDirectoryInfoWrapper">
                    <div className="artistDirectoryName">Crusty Cuts</div>
                    <div className="artistDirectoryHandle">@crustcuts</div>
                    <div className="artistDirectoryNumPacks">3 beat packs</div>
                  </div>
                </div>
                <div className="bioTitle">BIO</div>
                <div className="artistBioDirectory">
                  Liam O’Neil a.k.a Crusty Cuts is one of the most talented
                  individuals living in Burlington, VT. With an effortless style
                  that weaves the worlds of skate, snowboard, and hip hop
                  cultures, Liam stands in stark contrast to most millennial
                  DJ’s. Harnessing the authenticity that comes from playing real
                  vinyl during his live sets and incorporating analog equipment
                  into his production work, the music he creates under the
                  Crusty Cuts moniker is an airy reprieve from the heavy digital
                  sounds coming from most modern speakers. Harnessing the
                  authenticity that comes from playing real vinyl during his
                  live sets and incorporating analog equipment into his
                  production work, the music he creates under the Crusty Cuts
                  moniker is an airy reprieve from the heavy digital sounds
                  coming from most modern speakers.
                  <br />
                  <br /> - Matt McGinnis via Hemetic Trading Co.
                </div>
                <div className="bioTitle socialsTitle">SOCIALS</div>
                <div className="socialItemWrapper">
                  {" "}
                  <div className="socialItem">
                    <img src={Spotify} className="socialImg" />
                    <div className="socialTag">Spotify</div>
                  </div>
                  <div className="socialItem">
                    <img src={Instagram} className="socialImg" />
                    <div className="socialTag">Instagram</div>
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="beatPackTitleArtist">Beat Packs</div>
                <div className="beatPackArtistOuter">
                  <div className="beatPackArtistWrapper">
                    <img src={AlbumArt} className="artWork" />
                    <div className="packTitleDirectory">COMMODITIES VOL. 1</div>
                    <div className="editionAmountDirectory">Editions:6</div>
                  </div>
                  <div className="beatPackArtistWrapper">
                    <img src={AlbumArt} className="artWork" />
                    <div className="packTitleDirectory">COMMODITIES VOL. 1</div>
                    <div className="editionAmountDirectory">Editions:6</div>
                  </div>
                  <div className="beatPackArtistWrapper">
                    <img src={AlbumArt} className="artWork" />
                    <div className="packTitleDirectory">COMMODITIES VOL. 1</div>
                    <div className="editionAmountDirectory">Editions:6</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Footer white={true} />
        </div>
      </React.StrictMode>
    );
  }
}

export default Sequencer;
