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
import { Limiter, ToneAudioNode } from "tone";
import axios from "axios";
import { ethers, utils } from "ethers";
import Countdown from "react-countdown";
import config from "./config.json";
import clone from "clone";

const rhythmPads = [[0], [0], [0], [0], [0], [0], [0], [0]];

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
    pads: {},
    step: 0,
    steps: 8,
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
  };

  constructor(props) {
    super(props);

    this.players = {};

    this.fetchNFT();

    this.canvas = createRef();

    this.initWallet();
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

    const orderResponse = await axios.get(
      config.dev
        ? "https://rinkeby-api.opensea.io/wyvern/v1/orders"
        : "https://api.opensea.io/wyvern/v1/orders",
      {
        params: {
          asset_contract_address: nftResponse.data.tokenAddress,
          token_id: nftResponse.data.tokenId,
          limit: 50,
          side: 0,
          order_by: "eth_price",
          order_direction: "desc",
        },
      }
    );

    const addresses = orderResponse.data.orders.map((order) => {
      return order.maker.address.toLowerCase();
    });

    const usersResponse = await axios.get("/api/getUsers", {
      params: {
        addresses,
      },
    });

    this.setState({
      nft: nftResponse.data,
      bids: orderResponse.data.orders,
      users: usersResponse.data,
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
            new Tone.Player(`${pathRoot}/public/${filePath}`).toDestination()
          );
          pads[group].push(0);
        });
      });

      this.setState({ pads, queue, padFormat: sixBySixThreeGroups });

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
          Object.keys(this.state.queue).forEach((group) => {
            updatedPads[group] = Array.from(
              { length: this.state.pads[group].length },
              () => 0
            );
            this.state.queue[group]
              .slice(-this.state.nft.activeSoundLimits[group])
              .forEach((soundIndex) => {
                this.players[group][soundIndex].start();
                updatedPads[group][soundIndex] = 1;
              });
          });

          this.setState({ pads: updatedPads });
        }

        this.setState((state) => ({
          step: (state.step + 1) % state.steps,
        }));
      }, "4n");

      Tone.loaded().then(() => {
        this.setState(() => ({
          loaded: true,
        }));
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
    this.setState(
      (state) => {
        const clonedPads = { ...state.pads };
        const padState = clonedPads[group][pad];
        const updatedQueue = { ...state.queue };

        let numPads = this.state.totalSoundsPlaying;

        // Need to limit number of playable sounds?
        // clonedPads[group] = [0, 0, 0, 0, 0, 0, 0, 0]
        if (padState === 1) {
          this.players[group][pad].stop();
          updatedQueue[group] = updatedQueue[group].filter(
            (soundIndex) => soundIndex !== pad
          );
        }

        if (padState == 0) {
          numPads += 1;
          updatedQueue[group].push(pad);
        } else {
          numPads -= 1;
        }

        clonedPads[group][pad] = padState === 1 ? 0 : 1;

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
    } = this.state;

    const currentBidAmount =
      bids.length > 0
        ? parseFloat(utils.formatEther(bids[0].base_price)).toPrecision(4) / 1
        : 0;

    // Set up active sounds limit
    if (nft && loaded) {
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
            <div className="gridTop">
              {rhythmPads.map((group, groupIndex) => (
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
              <div className="gridOuter">
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
                    return (
                      <div
                        key={`pad-group-${i}`}
                        className={`${cx("pad", {
                          on,
                        })} ${blinkClass}`}
                        onClick={() => {
                          this.togglePad(group, soundIndex);
                        }}
                      />
                    );
                  });
                })}
              </div>
              <div className="currentBid">Current Bid</div>
              <div className="ethAmount">{`${currentBidAmount} ETH`}</div>
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

            <Footer
              white={false}
              loggedIntoMetamaskOverride={isLoggedIntoMetamask}
            />
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
                <div className="bidOnDesktop">
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
          </div>
        </React.StrictMode>
      );
    } else {
      return <div>Loading samples...</div>;
    }
  }
}

export default Sequencer;
