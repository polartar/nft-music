/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef } from "react";
import cx from "classnames";
import Synth from "./Synth";
// import Canvas from './Canvas';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import SecretGardenLogo from "./images/SecretGarden.png";
import AlbumArt from "./images/albumArt.png";
import InstaPic from "./images/instaPic.png";
import Wallet from "./images/wallet.png";
import Expand from "./images/expand.png";
import BidModal from "./components/BidModal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import * as Tone from "tone";
import { ToneAudioNode } from "tone";
import axios from "axios";
import { ethers, utils } from "ethers";

const rhythmPads = [[0], [0], [0], [0], [0], [0], [0], [0]];

const defaultPads = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let ctx, x_end, y_end, bar_height;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 555;
const bar_width = 1;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;

class Sequencer extends Component {
  state = {
    type: "sine",
    pads: defaultPads,
    bpm: 110,
    release: 100,
    step: 0,
    steps: 8,
    playing: false,
    octave: 4,
    delay: false,
    loaded: false,
    totalSoundsPlaying: 0,
    testAr: new Array(36).fill("hi"),
    openBidModal: false,
    nft: null,
    isLoggedIntoMetamask: false,
    provider: null,
    address: null,
    balance: 0,
    playingPadsCoordinates: [],
  };

  constructor(props) {
    super(props);

    this.players = [
      [
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.1.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.2.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.3.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.4.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.5.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.6.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.7.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.8.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.9.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.10.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.11.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.12.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.13.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.14.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/sounds.1.15.ogg"
        ).toDestination(),
      ],
      [
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.1.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.2.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.3.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.4.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.5.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.6.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.7.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.8.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.9.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/bass.1.10.ogg"
        ).toDestination(),
      ],
      [
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.1.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.2.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.3.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.4.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.5.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.6.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.7.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.8.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.9.ogg"
        ).toDestination(),
        new Tone.Player(
          "./public/artists/madeon/adventure/drum.1.10.ogg"
        ).toDestination(),
      ],
    ];

    this.analysers = [];
    for (var i = 0; i < this.players.length; i++) {
      var group = this.players[i];
      var groupAnalyser = [];
      for (var j = 0; j < group.length; j++) {
        var player = group[j];
        let analyser = new Tone.FFT(256);
        if (i == 2) {
          analyser.set({
            size: 256,
            smoothing: 0.99,
          });
        } else {
          analyser.set({
            size: 256,
            smoothing: 0.9,
          });
        }

        analyser.normalRange = true;
        player.connect(analyser);
        groupAnalyser.push(analyser);
      }
      this.analysers.push(groupAnalyser);
    }

    Tone.loaded().then(() => {
      this.setState(() => ({
        loaded: true,
      }));
    });

    Tone.Transport.bpm.value = this.state.bpm;
    Tone.Transport.scheduleRepeat((time) => {
      // use the callback time to schedule events
      console.log(this.state.step);
      if (this.state.step === 0) {
        const toBePlayed = [];
        this.state.pads.forEach((row, i) => {
          row.forEach((col, j) => {
            if (col === 1) {
              toBePlayed.push([i, j]);
            }
          });
        });

        toBePlayed.forEach((coordinate) => {
          this.players[coordinate[0]][coordinate[1]].start();
        });
      }
      this.setState((state) => ({
        step: state.step < state.steps - 1 ? state.step + 1 : 0,
      }));
    }, "4n");

    this.canvas = createRef();

    this.fetchNFT();
    // this.initWallet();
  }

  initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.listAccounts();

    if (accounts.length > 0) {
      const address = await provider.getSigner().getAddress();

      this.setState({
        isLoggedIntoMetamask: true,
        provider,
        address,
        balance: await provider.getBalance(address),
      });
    }
  };

  connectWallet = async () => {
    await window.ethereum.enable();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const address = await provider.getSigner().getAddress();

    this.setState({
      isLoggedIntoMetamask: true,
      provider,
      address,
    });
  };

  fetchNFT = async () => {
    const nftResponse = await axios.get("/api/getNFT", {
      params: {
        artistName: "Robotaki",
        nftName: "The Grand Mirage",
        edition: 1,
      },
    });

    this.setState({ nft: nftResponse.data });
  };

  componentDidMount() {}

  handleClickOpen = async () => {
    try {
      if (!this.state.isLoggedIntoMetamask) {
        await this.connectWallet();
      }
      this.setState({
        openBidModal: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleClose = (value) => {
    this.setState({
      openBidModal: false,
    });
  };

  togglePlay = () => {
    this.rafId = requestAnimationFrame(() => this.tick());
  };

  tick = () => {
    if (this.state.totalSoundsPlaying > 0) {
      this.animationLooper(this.canvas.current);
      this.rafId = requestAnimationFrame(() => this.tick());
    } else {
      this.animationLooperEmpty(this.canvas.current);
      this.rafId = requestAnimationFrame(() => this.tick());
    }
  };

  animationLooper(canvas) {
    let analyser = new Array(256).fill(0);

    for (var i = 0; i < this.analysers.length; i++) {
      var group = this.analysers[i];
      for (var j = 0; j < group.length; j++) {
        if (this.players[i][j].state == "started") {
          var analyserTemp = group[j];
          var frequency_array_vals = analyserTemp.getValue();

          var sum = frequency_array_vals.map(function(num, idx) {
            return num + analyser[idx];
          });

          analyser = sum;
        }
      }
    }

    let frequency_array = new Uint8Array(analyser.map((x) => x * 7000));
    canvas.width = window.innerWidth;
    canvas.height = 500;

    var x = 0;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var bufferLength = frequency_array.length;
    var barWidth = (canvas.width / bufferLength) * 2.5;
    // ctx.globalCompositeOperation = 'destination-over'

    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < bufferLength; i++) {
      var barHeight;
      if (frequency_array[i] < 20) {
        barHeight = frequency_array[i] * 3;
      } else {
        barHeight = frequency_array[i] * 1;
      }

      var r = barHeight + 25 * (i / bufferLength);
      var g = 250 * (i / bufferLength);
      var b = 50;

      // ctx.fillStyle = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')'
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }
  animationLooperEmpty(canvas) {
    let analyser = new Array(256).fill(0);
    let frequency_array = new Uint8Array(analyser);

    canvas.width = window.innerWidth;
    canvas.height = 500;

    var x = 0;

    let ctx = canvas.getContext("2d");
    var bufferLength = frequency_array.length;
    var barWidth = (canvas.width / bufferLength) * 2;

    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < bufferLength; i++) {
      var barHeight;
      if (frequency_array[i] < 20) {
        barHeight = frequency_array[i] * 3;
      } else {
        barHeight = frequency_array[i] * 1.25;
      }

      var r = barHeight + 25 * (i / bufferLength);
      var g = 250 * (i / bufferLength);
      var b = 50;

      ctx.fillStyle = "rgb(" + 31 + "," + 31 + "," + 31 + ")";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.17)";
      ctx.strokeRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  componentWillUnmount() {
    // cancelAnimationFrame(this.rafId)
    // this.analyser.disconnect()
    // this.source.disconnect()
  }

  // toggleTest = () => {
  //   this.audio.play()
  // }

  changeRelease(release) {
    this.setState(
      {
        release,
      },
      () => {
        this.pause();

        if (this.state.playing) this.play();
      }
    );
  }

  changeBPM(bpm) {
    if (bpm > 300 || bpm < 60) return;

    this.setState(
      () => ({
        bpm,
      }),
      () => {
        this.pause();

        if (this.state.playing) this.play();
      }
    );
  }

  changeWaveType(type) {
    this.setState(
      () => ({
        type,
      }),
      () => {
        this.pause();

        if (this.state.playing) this.play();
      }
    );
  }

  changeOctave(octave) {
    this.setState(
      {
        octave: Number(octave),
        notes: getNotesForOctave(Number(octave)),
      },
      () => {
        this.pause();

        if (this.state.playing) this.play();
      }
    );
  }

  play() {
    Tone.start();
    Tone.Transport.start();

    this.setState(() => ({
      playing: true,
    }));
  }

  pause() {
    this.setState(() => ({
      playing: false,
      step: 0,
    }));

    clearInterval(this.interval);
  }

  togglePad(group, pad) {
    this.setState(
      (state) => {
        const clonedPads = state.pads.slice(0);
        const padState = clonedPads[group][pad];

        let numPads = this.state.totalSoundsPlaying;

        // Need to limit number of playable sounds?
        // clonedPads[group] = [0, 0, 0, 0, 0, 0, 0, 0]
        if (padState === 1) {
          this.players[group][pad].stop();
        }
        if (padState == 0) {
          numPads += 1;
        } else {
          numPads -= 1;
        }

        clonedPads[group][pad] = padState === 1 ? 0 : 1;

        return {
          pads: clonedPads,
          totalSoundsPlaying: numPads,
        };
      },
      () => {
        if (!this.state.playing) this.play();
      }
    );
  }

  render() {
    const {
      pads,
      step,
      notes,
      loaded,
      nft,
      testAr,
      isLoggedIntoMetamask,
    } = this.state;

    if (nft && loaded) {
      return (
        <React.StrictMode>
          <BidModal
            nft={nft}
            open={this.state.openBidModal}
            onClose={this.handleClose}
          />
          <div className="container scrollBar">
            <div className="gridTop">
              {rhythmPads.map((group, groupIndex) => (
                <React.Fragment>
                  {group.map((pad, i) => (
                    <div
                      key={`pad-group-${i}`}
                      className={cx("modifiedPad", {
                        active: groupIndex === step,
                        on: pad === 1,
                      })}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>

            <Navbar
              white={false}
              loggedIntoMetamaskOverride={isLoggedIntoMetamask}
            />
            <div className="bodyWrapper scrollBar">
              <div className="beatPackTitle">{nft.name}</div>
              <div className="artistName">{nft.artistName}</div>
              <div className="gridOuter">
                {pads.map((group, groupIndex) => (
                  <React.Fragment>
                    {group.map((pad, i) => (
                      <div
                        key={`pad-group-${i}`}
                        className={cx("pad", {
                          on: pad === 1,
                        })}
                        onClick={() => {
                          this.togglePad(groupIndex, i);
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
                <div className="pad"></div>
              </div>
              <div className="currentBid">Current Bid</div>
              <div className="ethAmount">50.00 ETH</div>
              <div className="makeOfferText">Make an Offer</div>
              <a href="#album">
                <IconButton className="expandOuter">
                  <img src={Expand} className="expand" />
                </IconButton>
              </a>

              <div className="pageFooter scrollBar">
                <canvas ref={this.canvas} style={{ minWidth: "100%" }} />
              </div>
            </div>

            <Footer white={false} />
          </div>
          <div className="container2 scrollBar">
            <div className="albumWrapper">
              <div className="albumPicWrapper">
                <img src={nft.imageURL} className="albumPic" />
              </div>
              <div className="albumInfo">
                <div className="artistInfo" id="album">
                  <img src={nft.artist.imageURL} className="instaPic" />
                  <span className="artistTag">{nft.artistName}</span>
                </div>
                <div className="packTitle">{nft.name}</div>
                <div className="editionInfo">{`Edition: ${nft.edition}/5`}</div>
                <div className="bidInfoWrapper">
                  <div className="bidItem">
                    <div className="bidTitle">Current Bid</div>
                    <div className="bidInfo">50.00 ETH</div>
                  </div>
                  <div className="bidItem right">
                    <div className="bidTitle">TIME LEFT</div>
                    <div className="bidInfo">22 hrs, 45 min, 32 sec</div>
                  </div>
                </div>
                <Button className="offerButton" onClick={this.handleClickOpen}>
                  Make an Offer
                </Button>
                <div className="historyWrapper">
                  <div className="auctionTitle">Auction History</div>
                </div>
                <div className="tableWrapper scrollBar">
                  <table className="auctionPrices">
                    <tr>
                      <th>Price</th>
                      <th>Collector</th>
                      <th>Time</th>
                    </tr>

                    <tr>
                      <td>50.00 ETH</td>
                      <td>@NFTBidder</td>
                      <td>10:22 am</td>
                    </tr>
                    <tr>
                      <td>50.00 ETH</td>
                      <td>@NFTBidder</td>
                      <td>10:22 am</td>
                    </tr>
                    <tr>
                      <td>50.00 ETH</td>
                      <td>@NFTBidder</td>
                      <td>10:22 am</td>
                    </tr>
                    <tr>
                      <td>50.00 ETH</td>
                      <td>@NFTBidder</td>
                      <td>10:22 am</td>
                    </tr>
                    <tr>
                      <td>50.00 ETH</td>
                      <td>@NFTBidder</td>
                      <td>10:22 am</td>
                    </tr>
                    <tr>
                      <td>50.00 ETH</td>
                      <td>@NFTBidder</td>
                      <td>10:22 am</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </React.StrictMode>
      );
    } else {
      return <div>Loading samples...</div>;
    }
  }
}

export default Sequencer;
