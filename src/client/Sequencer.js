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
import WaterLoop from "./images/waterLoop.mp4";
import Wallet from "./images/wallet.png";
import Expand from "./images/expand.png";
import BidModal from "./components/BidModal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Twitter from "./images/twitter.png";
import * as Tone from "tone";
import { Limiter, ToneAudioNode } from "tone";
import axios from "axios";
import { ethers, utils } from "ethers";
import Countdown from "react-countdown";
import config from "./config.json";
import clone from "clone";
import Loading from "./components/Loading";
import Cookies from "universal-cookie";

const sixBySixThreeGroups = [
  [
    ["sounds", 0],
    ["sounds", 1],
    ["basses", 0],
    ["basses", 1],
    ["basses", 2],
    ["basses", 3],
  ],
  [
    ["sounds", 2],
    ["sounds", 3],
    ["sounds", 4],
    ["basses", 4],
    ["basses", 5],
    ["basses", 6],
  ],
  [
    ["drums", 0],
    ["sounds", 5],
    ["sounds", 6],
    ["sounds", 7],
    ["basses", 7],
    ["basses", 8],
  ],
  [
    ["drums", 1],
    ["drums", 2],
    ["sounds", 8],
    ["sounds", 9],
    ["sounds", 10],
    ["basses", 9],
  ],
  [
    ["drums", 3],
    ["drums", 4],
    ["drums", 5],
    ["sounds", 11],
    ["sounds", 12],
    ["sounds", 13],
  ],
  [
    ["drums", 6],
    ["drums", 7],
    ["drums", 8],
    ["drums", 9],
    ["sounds", 14],
    ["sounds", 15],
  ],
];

const fiveByFiveThreeGroups = [
  [
    ["sounds", 0],
    ["sounds", 1],
    ["basses", 0],
    ["basses", 1],
    ["basses", 2],
  ],
  [
    ["sounds", 2],
    ["sounds", 3],
    ["sounds", 4],
    ["basses", 3],
    ["basses", 4],
  ],
  [
    ["drums", 0],
    ["sounds", 5],
    ["sounds", 6],
    ["sounds", 7],
    ["basses", 5],
  ],
  [
    ["drums", 1],
    ["drums", 2],
    ["sounds", 8],
    ["sounds", 9],
    ["sounds", 10],
  ],
  [
    ["drums", 3],
    ["drums", 4],
    ["drums", 5],
    ["sounds", 11],
    ["sounds", 12],
  ],
];

const padFormatMappings = {
  sixBySixThreeGroups,
  fiveByFiveThreeGroups,
};

const padFormatTileStyleMappings = {
  sixBySixThreeGroups: "tile36",
  fiveByFiveThreeGroups: "tile25",
};

let ctx, x_end, y_end, bar_height;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 555;
const bar_width = 1;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;

const cookies = new Cookies();
const current = new Date();
const nextYear = new Date();

nextYear.setFullYear(current.getFullYear() + 1);

const didVisitSite = Boolean(cookies.get("didVisitSecretGarden"));
cookies.set("didVisitSecretGarden", true, { path: "/", expires: nextYear });

class Sequencer extends Component {
  state = {
    type: "sine",
    pads: {},
    step: 0,
    steps: 0,
    playing: false,
    delay: false,
    loaded: false,
    totalSoundsPlaying: 0,
    openBidModal: false,
    nft: null,
    isLoggedIntoMetamask: false,
    provider: null,
    address: null,
    balance: 0,
    bids: [],
    users: {},
    queue: {},
    padFormat: [],
    padFormatStyleClass: "",
    shareablePadNumbers: [],
    showTutorial: !didVisitSite,
    tutorialStep: 0,
  };

  constructor(props) {
    super(props);

    this.players = {};
    this.rhythmPads = [];

    this.fetchNFT();

    this.canvas = createRef();

    this.initWallet();
    this.myRef = React.createRef();
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
    let nftResponse;
    if (this.props.match) {
      nftResponse = await axios.get("/api/getNFT", {
        params: this.props.match.params,
      });
    } else {
      nftResponse = await axios.get("/api/getFeaturedNFT");
    }

    try {
      const orderResponse = await axios.get("/api/getOrdersForNFT", {
        params: {
          nftID: nftResponse.data._id,
          useTestnet: config.dev,
        },
      });

      const addresses = orderResponse.data.orders.map((order) => {
        return order.maker.address.toLowerCase();
      });

      const usersResponse = await axios.get("/api/getUsers", {
        params: {
          addresses,
        },
      });

      this.setState({
        bids: orderResponse.data.orders,
        users: usersResponse.data,
      });
    } catch (error) {
      console.log(error);
    }

    this.setState({
      nft: nftResponse.data,
    });

    const pathRoot = config.root;

    // Initial pads setup
    if (!Object.keys(this.players).length) {
      const pads = {};
      const queue = {};

      Object.keys(nftResponse.data.filePaths).map((group) => {
        const filePaths = nftResponse.data.filePaths[group];
        this.players[group] = [];
        pads[group] = [];
        queue[group] = [];

        filePaths.forEach((filePath) => {
          this.players[group].push(
            new Tone.Player(
              `${pathRoot}/public/${encodeURIComponent(filePath)}`
            ).toDestination()
          );

          pads[group].push(0);
        });
      });

      const padFormat = padFormatMappings[nftResponse.data.padFormatName];
      const padFormatStyleClass =
        padFormatTileStyleMappings[nftResponse.data.padFormatName];

      const steps = nftResponse.data.steps;

      this.rhythmPads = new Array(steps).fill([0]);

      this.setState({ pads, queue, padFormat, steps, padFormatStyleClass });

      this.analysers = {};

      for (let group in this.players) {
        var sounds = this.players[group];
        this.analysers[group] = [];
        for (var soundIndex = 0; soundIndex < sounds.length; soundIndex++) {
          var player = sounds[soundIndex];
          let analyser = new Tone.FFT(256);

          analyser.set({
            size: 256,
            smoothing: 0.9,
          });

          analyser.normalRange = true;
          player.connect(analyser);
          this.analysers[group].push(analyser);
        }
      }

      Tone.Transport.bpm.value = nftResponse.data.bpm;
      Tone.Transport.scheduleRepeat((time) => {
        if (this.state.step === 0) {
          const updatedPads = {};
          const updatedQueue = {};
          let updatedTutorialStep = this.state.tutorialStep;
          let updatedShowTutorial = this.state.showTutorial;
          let didPlayDrums = false;
          let didPlayBasses = false;
          let didPlaySounds = false;

          Object.keys(this.state.queue).forEach((group) => {
            updatedPads[group] = Array.from(
              { length: this.state.pads[group].length },
              () => 0
            );

            updatedQueue[group] = this.state.queue[group].slice(
              -this.state.nft.activeSoundLimits[group]
            );

            updatedQueue[group].forEach((soundIndex) => {
              this.players[group][soundIndex].start(time);
              updatedPads[group][soundIndex] = 1;

              if (group === "drums") {
                didPlayDrums = true;
              } else if (group === "basses") {
                didPlayBasses = true;
              } else if (group === "sounds") {
                didPlaySounds = true;
              }
            });
          });

          if (this.state.showTutorial) {
            if (this.state.tutorialStep === 3) {
              updatedShowTutorial = false;
            }

            if (
              (this.state.tutorialStep === 0 && didPlayDrums) ||
              (this.state.tutorialStep === 1 && didPlayBasses) ||
              (this.state.tutorialStep === 2 && didPlaySounds)
            ) {
              updatedTutorialStep += 1;
            }
          }

          const updatedShareablePadNumbers = [];
          this.state.padFormat.forEach((column, j) => {
            column.forEach((remappedCoordinates, i) => {
              const group = remappedCoordinates[0];
              const soundIndex = remappedCoordinates[1];
              if (updatedQueue[group].includes(soundIndex)) {
                updatedShareablePadNumbers.push(
                  j * this.state.padFormat.length + i
                );
              }
            });
          });

          this.setState({
            pads: updatedPads,
            queue: updatedQueue,
            shareablePadNumbers: updatedShareablePadNumbers,
            showTutorial: updatedShowTutorial,
            tutorialStep: updatedTutorialStep,
          });
        }

        this.setState((state) => ({
          step: (state.step + 1) % state.steps,
        }));
      }, "4n");

      Tone.loaded().then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedPadNumbers = urlParams.get("share");

        this.setState(
          () => ({
            loaded: true,
            showTutorial:
              this.state.showTutorial && sharedPadNumbers !== null
                ? false
                : this.state.showTutorial,
          }),
          () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedPadNumbers = urlParams.get("share")
              ? urlParams.get("share").split(",")
              : [];

            if (sharedPadNumbers.length > 0) {
              this.setState({ showTutorial: false });
            }

            sharedPadNumbers.forEach((padNumber) => {
              const col = parseInt(padNumber / this.state.padFormat.length);
              const row = parseInt(padNumber % this.state.padFormat.length);

              const remappedCoordinates = this.state.padFormat[col][row];
              const group = remappedCoordinates[0];
              const soundIndex = remappedCoordinates[1];
              this.togglePad(group, soundIndex);
            });
          }
        );
      });
    }
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

  executeScroll = () => this.myRef.current.scrollIntoView();

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

    for (let group in this.analysers) {
      var sounds = this.analysers[group];
      for (var soundIndex = 0; soundIndex < sounds.length; soundIndex++) {
        if (this.players[group][soundIndex].state === "started") {
          var analyserTemp = sounds[soundIndex];
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

    // ctx.fillStyle = "#1f1f1f";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  play() {
    Tone.start();
    Tone.Transport.start();
    this.togglePlay();

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
    if (this.state.showTutorial) {
      if (group === "basses" && this.state.tutorialStep < 1) {
        return;
      } else if (group === "sounds" && this.state.tutorialStep < 2) {
        return;
      }
    }

    this.setState(
      (state) => {
        const clonedPads = { ...state.pads };
        const padState = clonedPads[group][pad];
        const updatedQueue = { ...state.queue };

        let numPads = this.state.totalSoundsPlaying;

        // If pad was previously off, we're turning it on
        if (padState == 0) {
          numPads += 1;
          updatedQueue[group].push(pad);
        } else {
          numPads -= 1;
          this.players[group][pad].stop();
          updatedQueue[group] = updatedQueue[group].filter(
            (soundIndex) => soundIndex !== pad
          );
        }

        clonedPads[group][pad] = padState === 1 ? 0 : 1;

        const unstartedQueueGroup = updatedQueue[group].filter(
          (soundIndex) => this.players[group][soundIndex].state !== "started"
        );

        const startedQueueGroup = updatedQueue[group].filter(
          (soundIndex) => this.players[group][soundIndex].state === "started"
        );

        // We shaved something off, let's make it stop blinking
        if (unstartedQueueGroup.length > state.nft.activeSoundLimits[group]) {
          const toRemove = unstartedQueueGroup.slice(
            0,
            -state.nft.activeSoundLimits[group]
          );

          toRemove.forEach((soundIndex) => {
            clonedPads[group][soundIndex] = 0;
          });

          updatedQueue[group] = [
            ...startedQueueGroup,
            ...unstartedQueueGroup.slice(-state.nft.activeSoundLimits[group]),
          ];
        }

        return {
          pads: clonedPads,
          totalSoundsPlaying: numPads,
          queue: updatedQueue,
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
      steps,
      notes,
      loaded,
      nft,
      isLoggedIntoMetamask,
      bids,
      users,
      padFormat,
      padFormatStyleClass,
      shareablePadNumbers,
      showTutorial,
      tutorialStep,
    } = this.state;

    console.log(showTutorial);

    const currentBidAmount =
      bids.length > 0
        ? parseFloat(utils.formatEther(bids[0].base_price)).toPrecision(4) / 1
        : 0;

    // Set up active sounds limit
    if (nft && loaded) {
      const mediaFileExtension = nft.imageURL
        .split(".")
        .pop()
        .toLowerCase();
      return (
        <React.StrictMode>
          <BidModal
            nft={nft}
            open={this.state.openBidModal}
            onClose={this.handleClose}
            didCompleteBid={this.fetchNFT}
            currentBidAmount={currentBidAmount}
          />
          <div className="container scrollBar">
            <video
              className="waterLoopVideo"
              autoplay="true"
              muted="true"
              loop="true"
            >
              <source src={WaterLoop} type="video/mp4" />
            </video>
            <div className="gridTop">
              {this.rhythmPads.map((group, groupIndex) => (
                <React.Fragment>
                  {group.map((pad, i) => (
                    <div
                      key={`pad-group-${i}`}
                      className={cx("modifiedPad", {
                        active:
                          groupIndex === (((step - 1) % steps) + steps) % steps,
                        on: pad === 1,
                      })}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>

            <Navbar
              white={false}
              didConnectWallet={this.initWallet}
              loggedIntoMetamaskOverride={isLoggedIntoMetamask}
            />
            <div className="bodyWrapper scrollBar">
              <div className="beatPackTitle">{nft.name}</div>
              <div className="artistName">{nft.artistName}</div>
              <div className={`gridOuter ${padFormatStyleClass}`}>
                {padFormat.map((column, j) => {
                  return column.map((remappedCoordinates, i) => {
                    const group = remappedCoordinates[0];
                    const soundIndex = remappedCoordinates[1];
                    const on =
                      this.players[group][soundIndex].state === "started";
                    const blinkClass =
                      pads[group][soundIndex] === 1 &&
                      this.players[group][soundIndex].state !== "started"
                        ? "blink"
                        : "";
                    const whiteClass = group === "sounds" ? "whitePad" : "";
                    let tutorialClass = "";
                    const padClass =
                      group == "sounds" ? "padWhiteVersion" : "pad";

                    if (showTutorial) {
                      if (tutorialStep === 0 && group !== "drums") {
                        tutorialClass = "tutorialPad";
                      } else if (tutorialStep === 1 && group !== "basses") {
                        tutorialClass = "tutorialPad";
                      } else if (tutorialStep === 2 && group !== "sounds") {
                        tutorialClass = "tutorialPad";
                      }
                    }
                    return (
                      <div
                        key={`pad-group-${i}`}
                        className={`${cx(padClass, {
                          on,
                        })} ${blinkClass} ${whiteClass} ${tutorialClass}`}
                        onClick={() => {
                          this.togglePad(group, soundIndex);
                        }}
                      />
                    );
                  });
                })}
              </div>
              {showTutorial && (
                <React.Fragment>
                  {tutorialStep === 0 && (
                    <React.Fragment>
                      <div className="currentBid tile25 tutorialStep">
                        Welcome to Secret Garden.
                      </div>
                      <div className="tutorialInfo">
                        To begin, press one of the highlighted squares on the
                        left. These are the drum loops. <br />
                        Only one will play at a time.
                      </div>
                    </React.Fragment>
                  )}
                  {tutorialStep === 1 && (
                    <div className="tutorialInfo tutorialFormatting">
                      Now, press one of the highlighted squares on the right.
                      These are the bass loops. <br />
                      When the pad is flashing, the sound will wait to play
                      until the next bar.
                      <br /> Only one will play at a time.
                    </div>
                  )}
                  {tutorialStep === 2 && (
                    <div className="tutorialInfo tutorialFormatting">
                      {`Lastly, press one of grey squares in the middle. These are
                      chords and melodies. Up to ${nft.activeSoundLimits["sounds"]} can play at at time.`}
                    </div>
                  )}
                  {tutorialStep === 3 && (
                    <div className="tutorialInfo tutorialFormatting">
                      You're ready to make some music! <br />
                      Try out different combinations and share them with friends
                      below. <br />
                      If you'd like to make an offer on this sequencer, click
                      the arrow below or scroll down.
                    </div>
                  )}
                </React.Fragment>
              )}
              {!showTutorial && (
                <React.Fragment>
                  <div className="currentBid tile25">Current Bid</div>
                  <div className="ethAmount">{`${currentBidAmount} ETH`}</div>
                </React.Fragment>
              )}
              {(tutorialStep === 3 || !showTutorial) && (
                <React.Fragment>
                  <div className="makeOfferText">Make an Offer</div>
                  <IconButton
                    className="expandOuter"
                    onClick={this.executeScroll}
                  >
                    <img src={Expand} className="expand" />
                  </IconButton>
                </React.Fragment>
              )}

              <div className="pageFooter scrollBar">
                <canvas ref={this.canvas} style={{ minWidth: "100%" }} />
              </div>
            </div>

            <Footer
              white={false}
              showShare
              shareURL={`https://secretgarden.fm/?share=${shareablePadNumbers.join(
                ","
              )}`}
              loggedIntoMetamaskOverride={isLoggedIntoMetamask}
            />
          </div>
          <div className="container2 scrollBar">
            <div className="albumWrapper">
              <div className="albumPicWrapper">
                {mediaFileExtension === "mp4" && (
                  <video
                    width="140"
                    height="140"
                    autoplay="true"
                    muted="true"
                    loop="true"
                  >
                    <source src={nft.imageURL} type="video/mp4" />
                  </video>
                )}
                {mediaFileExtension !== "mp4" && (
                  <img src={nft.imageURL} className="albumPic" />
                )}
              </div>
              <div className="albumInfo" ref={this.myRef}>
                <div className="artistInfo" id="album">
                  <img src={nft.artist.imageURL} className="instaPic" />
                  <span className="artistTag">{nft.artistName}</span>
                </div>
                <div className="packTitle">{nft.name}</div>
                <div className="editionInfo">{`Edition: ${nft.edition}`}</div>
                <div className="bidInfoWrapper">
                  <div className="bidItem">
                    <div className="bidTitle">Current Bid</div>
                    <div className="bidInfo">{`${currentBidAmount} ETH`}</div>
                  </div>
                  <div className="bidItem right">
                    <div className="bidTitle">TIME LEFT</div>
                    <Countdown
                      date={nft.bidEndDate}
                      renderer={({
                        days,
                        hours,
                        minutes,
                        seconds,
                        completed,
                      }) => {
                        if (completed) {
                          // Render a completed state
                          return (
                            <div className="bidInfo">Auction Completed</div>
                          );
                        } else {
                          // Render a countdown
                          return (
                            <div className="bidInfo">{`${days} days, 
                              ${hours} hrs, ${minutes} mins, ${seconds} secs`}</div>
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <Button className="offerButton" onClick={this.handleClickOpen}>
                  Make an Offer
                </Button>
                <div className="nftDetails">
                  Winning bid receives an NFT for the artwork, lossless sound
                  files, and a non-exclusive license for distribution.
                </div>
                <div className=" bidOnDesktop">
                  Sign in on Desktop to place bid
                </div>
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
                    {bids.map((bid) => {
                      const formattedBidAmount =
                        parseFloat(
                          utils.formatEther(bid.base_price)
                        ).toPrecision(4) / 1;

                      return (
                        <tr>
                          <td>{`${formattedBidAmount} ETH`}</td>
                          <td>
                            <a href={`/collection/${bid.maker.address}`}>
                              <div className="makerAddr">
                                {users[bid.maker.address]
                                  ? users[bid.maker.address].name
                                  : bid.maker.address}
                              </div>
                            </a>
                          </td>
                          <td>
                            {`${new Date(
                              bid.created_date + "Z"
                            ).toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                            })}, ${new Date(
                              bid.created_date + "Z"
                            ).toLocaleTimeString()}`}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            </div>
            <div className="ourSocials">
              <span>inquiries@secretgarden.fm</span>
              <a href="https://twitter.com/SecretG59357898" target="_blank">
                <img src={Twitter} className="ourTwitter" />
              </a>
            </div>
          </div>
        </React.StrictMode>
      );
    } else {
      return <Loading />;
    }
  }
}

export default Sequencer;
