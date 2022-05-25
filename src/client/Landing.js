/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { useState, Component, createRef } from "react";
import cx from "classnames";
import Synth from "./Synth";
// import Canvas from './Canvas';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import cloneDeep from "lodash.clonedeep";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import SecretGardenLogo from "./images/SecretGarden.png";
import AlbumArt from "./images/albumArt.png";
import InstaPic from "./images/instaPic.png";
import WaterLoop from "./images/waterScaleLoop.mp4";
import Wallet from "./images/wallet.png";
import Expand from "./images/expand.png";
import ArrowRight from "./images/arrowright.svg";

import BidModal from "./components/BidModal";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Twitter from "./images/twitter.png";
import Discord from "./images/discord.png";
import Instagram from "./images/instagram.png";
import * as Tone from "tone";
import { Limiter, ToneAudioNode } from "tone";
import axios from "axios";
import { ethers, utils } from "ethers";
import Countdown from "react-countdown";
import clone from "clone";
import Loading from "./components/Loading";
import Cookies from "universal-cookie";

import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import anime from "animejs/lib/anime.es.js";

import Lily from "./components/Lily";
import Chrysanthemum from "./components/Chrysanthemum";
import Hyacinth from "./components/Hyacinth";
import Carnation from "./components/Carnation";
import QuakingGrass from "./components/QuakingGrass";
import MonsteraLeaf from "./components/MonsteraLeaf";
import Tulip from "./components/Tulip";
import FlowerArrangement from "./components/FlowerArrangement";
import Stopwatch from "./components/Stopwatch";
import BouquetCarousel from "./components/BouquetCarousel";
import { withWeb3HOC } from "./Web3HOC";
import "./css/nftCarousel.scss";
import http from "http";
import https from "https";

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

const fiveByFiveFlower = [
  [
    ["sounds", 4],
    ["sounds", 1],
    ["sounds", 2],
    ["basses", 0],
    ["basses", 1],
  ],
  [
    ["sounds", 3],
    ["sounds", 0, "circlePad"],
    ["sounds", 5],
    ["basses", 2],
    ["basses", 3],
  ],
  [
    ["sounds", 6],
    ["sounds", 7],
    ["sounds", 8],
    ["basses", 4],
    ["sounds", 9],
  ],
  [
    ["drums", 0],
    ["drums", 1],
    ["drums", 2],
    ["sounds", 10],
    ["basses", 5],
  ],
  [
    ["drums", 3],
    ["drums", 4],
    ["sounds", 11],
    ["drums", 5],
    ["sounds", 12],
  ],
];

const padFormatMappings = {
  sixBySixThreeGroups,
  fiveByFiveThreeGroups,
  fiveByFiveFlower,
};

const padFormatTileStyleMappings = {
  sixBySixThreeGroups: "tile36",
  fiveByFiveThreeGroups: "tile25",
  fiveByFiveFlower: "tile25",
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
    volume: 0,
    padRecording: [],
    shouldStartRecording: false,
    shouldStopRecording: false,
    isRecording: false,
    recordingTimer: 0,
    recordingStatus: "",
    openControls: false,
    hideBeatpad: false,
    exportingStatus: "",
    startRecordingTime: "",
    endTotalRecordingTime: "",
    // downloadPercentage: 0,
  };

  constructor(props) {
    super(props);

    this.players = {};
    this.rhythmPads = [];

    this.fetchNFT();

    this.cablesCanvas = createRef();
    this.canvas = createRef();

    this.initWallet();
    this.myRef = React.createRef();
    this.clearSelections = this.clearSelections.bind(this);
    this.activePlayers = {};
    this.recorder = new Tone.Recorder();

    this.mobileTouchStart = 0;
    this.idle = true;
    this.activeFPIndex = 0;
    this.activeFAQSlideIndex = 0;

    this.activeAnimations = {};
  }

  initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.listAccounts();

    window.ethereum.on("accountsChanged", function(accounts) {
      location.reload();
    });

    window.ethereum.on("chainChanged", (chainId) => {
      location.reload();
    });

    if (accounts.length > 0) {
      const address = await provider.getSigner(0).getAddress();

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
    const address = await provider.getSigner(0).getAddress();

    this.setState({
      isLoggedIntoMetamask: true,
      provider,
      address,
    });
  };

  exportRecording = async (blob) => {
    this.setState({
      exportingStatus: `Exporting, please wait...`,
    });
    this.calculateProgressPercentage();
    // setTimeout(() => {
    //   this.setState({
    //     exportingStatus: "",
    //   });
    // }, ((this.state.endTotalRecordingTime - this.state.startRecordingTime))*1.3 || 20000);

    try {
      const form = new FormData();

      const agentOptions = {
        keepAlive: true, // Keep sockets around even when there are no outstanding requests, so they can be used for future requests without having to reestablish a TCP connection. Defaults to false
        keepAliveMsecs: 1000, // When using the keepAlive option, specifies the initial delay for TCP Keep-Alive packets. Ignored when the keepAlive option is false or undefined. Defaults to 1000.
        maxSockets: Infinity, // Maximum number of sockets to allow per host. Defaults to Infinity.
        maxFreeSockets: 256, // Maximum number of sockets to leave open in a free state. Only relevant if keepAlive is set to true. Defaults to 256.
      };

      form.append("video", blob);
      form.append("artistName", this.state.nft.artistName);
      form.append("nftName", this.state.nft.name);
      form.append("edition", this.state.nft.edition);
      //hardcoded launch date text, ideally this comes from the nft object
      // form.append("launchDate", "LAUNCH AND REVEAL " + "5/24");

      const response = await axios.post("/api/exportRecording", form, {
        responseType: "blob",
        httpAgent: new http.Agent(agentOptions),
        httpsAgent: new https.Agent(agentOptions),
      });

      const url = URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" })
      );
      const anchor = document.createElement("a");
      anchor.download = `My Mix of ${this.state.nft.name}.mp4`;
      anchor.href = url;
      anchor.click();

      console.log("exported");

      this.setState({
        exportingStatus: "",
      });
    } catch (error) {
      console.log(error);
      this.setState({
        exportingStatus: "Exporting failed, please try again.",
      });
    }
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

    this.setState({
      nft: nftResponse.data,
    });

    // Initial pads setup
    if (!Object.keys(this.players).length) {
      const pads = {};
      const queue = {};

      Object.keys(nftResponse.data.filePaths).map((group) => {
        const filePaths = nftResponse.data.filePaths[group];
        this.players[group] = [];
        pads[group] = [];
        queue[group] = [];

        this.activePlayers[group] = [];

        Object.keys(nftResponse.data.filePaths).map((group) => {
          const filePaths = nftResponse.data.filePaths[group];
          this.players[group] = [];
          pads[group] = [];
          queue[group] = [];

          filePaths.forEach((filePath) => {
            const player = new Tone.Player(
              `/public/${encodeURIComponent(filePath)}`
            );

            player.connect(this.recorder);
            this.players[group].push(player.toDestination());

            pads[group].push(0);
          });
        });
      });

      const padFormat = nftResponse.data.padFormat;
      const padFormatStyleClass = nftResponse.data.padStyle;

      const steps = nftResponse.data.steps;
      const subSteps = nftResponse.data.subSteps;

      this.rhythmPads = new Array(steps).fill([0]);

      if (nftResponse.data.blooms && nftResponse.data.blooms[0]) {
        padFormat.push(nftResponse.data.blooms[0]["stems"]);
      }

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
      Tone.Transport.scheduleRepeat(async (time) => {
        if (this.state.step % subSteps === 0) {
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

            if (updatedQueue[group].length !== this.state.queue[group].length) {
              for (let i = 0; i < this.players[group].length; i++) {
                if (!updatedQueue[group].includes(i)) {
                  this.players[group][i].stop();
                }
              }
            }

            updatedQueue[group].forEach((soundIndex) => {
              if (
                this.players[group][soundIndex].state !== "started" ||
                this.state.step === 0
              ) {
                this.players[group][soundIndex].start(
                  time,
                  `${Math.floor(this.state.step / 4)}:0:0`
                );
              }
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
            tutorialStep: updatedShowTutorial ? updatedTutorialStep : 0,
          });
        }

        if (this.state.step === 0) {
          if (this.state.shouldStartRecording) {
            this.recorder.start();

            //track and limit recording to 60 seconds
            let milliseconds = 0;

            const incrementMilliseconds = () => {
              if (this.state.recordingTimer >= 60000) {
                this.stopRecording();
              } else {
                this.setState({
                  recordingTimer: (milliseconds += 1000),
                });
              }
            };
            window.timer = setInterval(incrementMilliseconds, 1000);

            console.log("starting!");

            this.setState({
              shouldStartRecording: false,
              isRecording: true,
              recordingStatus: "Recording...",
            });
          }

          if (this.state.shouldStopRecording) {
            // the recorded audio is returned as a blob
            const recording = await this.recorder.stop();
            // this.exportRecording(recording);

            this.setState({
              shouldStopRecording: false,
              isRecording: false,
              recordingStatus: "Exporting...",
              recording,
              endTotalRecordingTime: Date.now(),
            });
          }
        }

        this.setState((state) => ({
          step: (state.step + 1) % state.steps,
        }));
      }, "4n");

      Tone.loaded().then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedPadNumbers = urlParams.get("share");
        let _this = this;
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

            _this.handleInitialAnimations();
            _this.setupSwayingAnimations();
          }
        );
      });
    }
  };

  didRender = async (blob) => {
    try {
      const form = new FormData();

      form.append("video", blob[0]);

      const response = await axios.post("/api/upload", form);
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "/public/artists/oksami/garden/visualizer/js/patch.js";
    script.async = true;

    document.body.appendChild(script);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.openControls !== this.state.openControls) {
      anime({
        targets: [".record-container"],
        easing: "easeInOutSine",
        duration: 750,
        opacity: 1,
        delay: 0,
      });
    }
  }

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
    if (this.state.totalSoundsPlaying > 0 && !this.state.showTutorial) {
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

    const isAllZero = frequency_array.every((item) => item === 0);

    if (!isAllZero) {
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
        ctx.fillStyle = `rgba(255, 255, 255, 1)`;
        // ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
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

    // ctx.fillStyle = "#1f1f1f";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    Tone.context.lookAhead = 0.1;
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

    // preserved for millisecond work
    // const milliseconds = cloneDeep(this.state.recordingTimer);

    if (this.state.padRecording.length <= 0) {
      this.setState({
        startRecordingTime: Date.now(),
      });
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

          // update active pads
          this.activePlayers[group].push(pad);
        } else {
          numPads -= 1;
          this.players[group][pad].stop();

          // update active pads
          this.activePlayers[group] = this.activePlayers[group].filter(
            (activePad) => activePad !== pad
          );
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

        if (this.state.shouldStartRecording || this.state.isRecording) {
          const pressedPad = [group, pad];
          const currentTime = Date.now();
          this.state.padFormat.forEach((column, j) => {
            column.forEach((mappedPad, i) => {
              if (
                mappedPad[0] === pressedPad[0] &&
                mappedPad[1] === pressedPad[1]
              ) {
                this.setState({
                  padRecording: [
                    ...this.state.padRecording,
                    // preserved for blockchain storage shape
                    // [j * this.state.padFormat.length + i, milliseconds]
                    // [group, pad, milliseconds]
                    [
                      group,
                      pad,
                      this.state.padRecording.length > 0
                        ? Number(currentTime - this.state.startRecordingTime)
                        : 0,
                    ],
                  ],
                });
              }
            });
          });
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

  // recording work
  startRecording() {
    var padRecording = [];
    //Check if there are existing stems playing and add them to the recording
    Object.keys(this.players).forEach((group) => {
      this.players[group].forEach((_, soundIndex) => {
        if (this.players[group][soundIndex].state == "started") {
          padRecording.push([group, soundIndex, 0]);
        }
      });
    });

    this.setState({
      padRecording,
      shouldStartRecording: true,
      recordingStatus: "Waiting for next loop to start...",
    });
    // window.timer = window.setInterval(incrementMilliseconds, 10);
    // intervals.push(setInterval(incrementMilliseconds, 10));
  }

  async stopRecording() {
    console.log("stopped recording");
    clearInterval(window.timer);

    this.setState({
      shouldStopRecording: true,
      recordingStatus: "Waiting for loop to end...",
      recordingTimer: 0,
    });
  }

  muiTheme = createTheme({
    overrides: {
      MuiSlider: {
        thumb: {
          color: "white",
        },
        track: {
          color: "white",
        },
        rail: {
          color: "white",
        },
      },
    },
  });

  setVolume(volume) {
    if (volume != null) {
      this.setState({
        volume: volume,
      });

      Object.keys(this.players).forEach((group) => {
        this.players[group].forEach((_, soundIndex) => {
          this.players[group][soundIndex].volume.value = volume;
        });
      });
    }
  }

  handleShuffle() {
    //shuffle function here
  }

  clearSelections() {
    // clear all setTimeouts for togglePad()'s
    let highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearInterval(i);
      }
    }, 0);

    // stop Transport step count
    Tone.Transport.stop();

    const updatedPads = {};
    const updatedQueue = {};

    Object.keys(this.players).forEach((group) => {
      updatedPads[group] = [];
      this.players[group].forEach((_, soundIndex) => {
        updatedPads[group][soundIndex] = 0;
        updatedQueue[group] = [];
      });
    });

    // update queue and se
    this.setState({
      pads: updatedPads,
      playing: false,
      queue: updatedQueue,
      shareablePadNumbers: [],
      totalSoundsPlaying: 0,
      step: 0, // reset step count to 0
      recordingStatus: "",
      isRecording: false,
      shouldStartRecording: false,
      shouldStopRecording: false,
      repeat: false,
      isPlayingBack: false,
      endOfPlayback: false,
    });

    for (const group in this.activePlayers) {
      if (this.activePlayers[group].length > 0) {
        // loop to stop active pads instead of entire player list
        for (let i = 0; i < this.activePlayers[group].length; i++) {
          this.players[group][this.activePlayers[group][i]].stop();
        }
      }
    }
  }

  playbackRecording(padRecording, callback) {
    // this.clearSelections();
    let highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearInterval(i);
      }
    }, 0);

    Tone.Transport.stop();

    const updatedPads = {};
    const updatedQueue = {};

    Object.keys(this.players).forEach((group) => {
      updatedPads[group] = [];
      this.players[group].forEach((_, soundIndex) => {
        updatedPads[group][soundIndex] = 0;
        updatedQueue[group] = [];
      });
    });

    // update queue and se
    this.setState({
      pads: updatedPads,
      playing: false,
      queue: updatedQueue,
      shareablePadNumbers: [],
      totalSoundsPlaying: 0,
      // step: 0, // reset step count to 0,
      step: this.state.steps - 1, // reset step count to 0,
      isPlayingBack: true,
    });

    for (const group in this.activePlayers) {
      if (this.activePlayers[group].length > 0) {
        // loop to stop active pads instead of entire player list
        for (let i = 0; i < this.activePlayers[group].length; i++) {
          this.players[group][this.activePlayers[group][i]].stop();
        }
      }
    }
    // end clear pads work

    for (let i = 0; i <= padRecording.length - 1; i++) {
      setTimeout(() => {
        // each loop, call passed in callback function
        callback(padRecording[i]);
        // stagger the pad's timeout by their milliseconds
        // }, i * pad[2]);
        // }, padRecording[i][2] + (padRecording[i - 1] ? padRecording[i - 1][2] : padRecording[0][2]));
        if (i === padRecording.length - 1) {
          this.setState({
            // isPlayingBack: false,
            endOfPlayback: true,
          });
        }
      }, padRecording[i][2]);
    }
  }

  touchStart = function(e) {
    this.mobileTouchStart = parseInt(e.changedTouches[0].clientY);
    window.scrollTop = 0;
  };

  touchMove = function(e) {
    let idle = this.idle;

    let mobileTouchEnd = parseInt(e.changedTouches[0].clientY);

    const delta = this.mobileTouchStart - mobileTouchEnd;
    window.scrollTop = 0;
    if (delta == 0) {
      //user tapped, don't do anything
      return;
    }

    if (idle) {
      const direction = delta > 0 ? "next" : "prev";
      this.handleScroll(direction);
    }
  };

  handleInitialAnimations = () => {
    let el = document.querySelector("#main-wrapper");
    //scroll handling
    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? "next" : "prev";
      this.handleScroll(direction);
    });
    //mobile touch controls
    el.addEventListener("touchstart", this.touchStart.bind(this));
    el.addEventListener("touchend", this.touchMove.bind(this));

    anime({
      targets: [
        ".video-container",
        ".beatPackTitle",
        ".launchdate-text",
        ".artistName",
        ".gridOuter",
      ],
      easing: "easeInOutSine",
      duration: 750,
      opacity: 1,
      delay: 1000,
    });

    anime({
      targets: [".play-controls", ".expandOuter"],
      easing: "easeInOutSine",
      duration: 750,
      opacity: 1,
      delay: 2000,
    });

    anime({
      targets: [
        "#video-player-section .lily",
        "#video-player-section .quaking-grass",
        "#video-player-section .carnation",
        "#video-player-section .hyacinth",
        "#video-player-section .chrysanthemum",
      ],
      easing: "easeInOutSine",
      duration: 500,
      opacity: 1,
      delay: 0,
    });
  };

  setupSwayingAnimations = () => {
    this.activeAnimations.lily = anime({
      targets: '[data-slideindex="0"] .lily path',
      easing: "easeInOutSine",
      duration: 1200,
      skewX: function() {
        return anime.random(0.5, 1);
      },
      skewY: function() {
        return anime.random(-0.25, -0.75);
      },
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    this.activeAnimations.quakingGrass = anime({
      targets: '[data-slideindex="0"] .quaking-grass path',
      easing: "easeInOutSine",
      duration: 1200,
      skewX: 0.8,
      skewY: -0.75,
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    this.activeAnimations.firstCarnation = anime({
      targets: '[data-slideindex="0"] .carnation path',
      easing: "easeInOutSine",
      duration: 1300,
      skewX: 0.7,
      skewY: -0.6,
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    this.activeAnimations.firstHyacinth = anime({
      targets: '[data-slideindex="0"] .hyacinth path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: 0.6,
      skewY: -0.5,
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    this.activeAnimations.firstChrysantheum = anime({
      targets: '[data-slideindex="0"] .chrysanthemum path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    //second section
    this.activeAnimations.secondSectionHyacinthes = anime({
      targets: '[data-slideindex="1"] .hyacinth path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: 0.6,
      skewY: -0.5,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });

    //third section
    this.activeAnimations.thirdSectionMonsteraLeaves = anime({
      targets: '[data-slideindex="2"] .monstera-leaf path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });

    this.activeAnimations.thirdSectionHyacinthes = anime({
      targets: '[data-slideindex="2"] .hyacinth path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: 0.6,
      skewY: -0.5,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });

    //fourth section
    this.activeAnimations.firstTulip = anime({
      targets: ".tulip #petals",
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });

    this.activeAnimations.fourthSectionMonsteraLeaves = anime({
      targets: '[data-slideindex="2"] .monstera-leaf path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });

    this.activeAnimations.fourthSectionCarnations = anime({
      targets: '[data-slideindex="2"] .carnation path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });

    this.activeAnimations.fourthSectionChrysantheum = anime({
      targets: '[data-slideindex="2"] .chrysanthemum path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });

    this.activeAnimations.fifthSectionHyacinth = anime({
      targets: '[data-slideindex="3"] .hyacinth path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: 0.6,
      skewY: -0.5,
      delay: 250,
      direction: "alternate",
      loop: true,
      autoPlay: false,
    });
  };

  handleNewFPSlideAnimation() {
    anime({
      targets: [".activeSlide .section-intro-text"],
      easing: "easeInOutSine",
      delay: 0,
      duration: 500,
      opacity: 1,
      translateY: [0, -10],
    });

    anime({
      targets: [".activeSlide .packTitle"],
      easing: "easeInOutSine",
      delay: 100,
      duration: 500,
      opacity: 1,
      translateY: [0, -10],
    });

    anime({
      targets: [`.activeSlide .details`],
      easing: "easeInOutSine",
      delay: 200,
      duration: 500,
      opacity: 1,
      translateY: [0, -10],
    });

    anime({
      targets: [`.activeSlide .expandOuter`],
      easing: "easeInOutSine",
      delay: 300,
      duration: 500,
      opacity: 1,
      translateY: [0, -10],
    });

    if (this.activeFPIndex == 0) {
      anime({
        targets: [
          "#video-player-section .lily",
          "#video-player-section .quaking-grass",
          "#video-player-section .carnation",
          "#video-player-section .hyacinth",
        ],
        easing: "easeInOutSine",
        duration: 500,
        opacity: 1,
        delay: 0,
      });

      this.activeAnimations.lily.play();
      this.activeAnimations.quakingGrass.play();
      this.activeAnimations.firstCarnation.play();
      this.activeAnimations.firstHyacinth.play();
      this.activeAnimations.firstChrysantheum.play();
    } else if (this.activeFPIndex == 1) {
      anime({
        targets: "#hyacinth-2",
        easing: "easeOutQuad",
        delay: 0,
        duration: 500,
        opacity: 1,
        translateY: [0, -10],
        rotate: [45, 45],
      });

      anime({
        targets: "#hyacinth-3",
        easing: "easeOutQuad",
        delay: 50,
        duration: 500,
        opacity: 1,
        translateY: [0, -10],
        rotate: [-30, -30],
      });

      anime({
        targets: "#main-flower",
        easing: "easeOutQuad",
        delay: 100,
        duration: 500,
        opacity: 1,
        translateY: [0, -10],
      });

      this.activeAnimations.firstChrysantheum.play();
      this.activeAnimations.secondSectionHyacinthes.play();
    } else if (this.activeFPIndex == 2) {
      // Removed slide 2
      //   anime({
      //     targets: "#leaf-1",
      //     easing: "easeInOutSine",
      //     delay: 100,
      //     duration: 500,
      //     opacity: 1,
      //     translateY: ["-50%", "-51%"],
      //
      //     rotate: [-10, -10],
      //   });
      //
      //   anime({
      //     targets: "#leaf-2",
      //     easing: "easeInOutSine",
      //     delay: 50,
      //     duration: 500,
      //     opacity: 1,
      //     rotate: [-5, -5],
      //     translateY: [0, -10],
      //   });
      //   anime({
      //     targets: "#hyacinth-4",
      //     easing: "easeInOutSine",
      //     delay: 50,
      //     duration: 500,
      //     opacity: 1,
      //     rotate: [200, 200],
      //     translateY: [0, -10],
      //   });
      //
      //   anime({
      //     targets: "#carnation-3",
      //     easing: "easeInOutSine",
      //     delay: 0,
      //     duration: 500,
      //     opacity: 1,
      //     rotate: [-30, -30],
      //     translateY: [0, -10],
      //   });
      //
      //   this.activeAnimations.thirdSectionHyacinthes.play();
      //   this.activeAnimations.thirdSectionMonsteraLeaves.play();
      // } else if (this.activeFPIndex == 3) {
      anime({
        targets: "#leaf-3",
        easing: "easeInOutSine",
        delay: 0,
        duration: 500,
        opacity: 1,
        rotate: [200, 200],
        translateY: [0, -10],
      });

      anime({
        targets: "#chrysanthemum-2",
        easing: "easeInOutSine",
        delay: 50,
        duration: 500,
        opacity: 1,
        rotate: [-30, -30],
        translateY: [0, -10],
      });

      anime({
        targets: "#carnation-2",
        easing: "easeInOutSine",
        delay: 100,
        duration: 500,
        opacity: 1,
        rotate: [-30, -30],
        translateY: [0, -10],
      });

      anime({
        targets: ".tulip",
        easing: "easeInOutSine",
        delay: 100,
        duration: 500,
        opacity: 1,
        translateY: [0, -10],
      });

      this.activeAnimations.fourthSectionCarnations.play();
      this.activeAnimations.fourthSectionChrysantheum.play();
      this.activeAnimations.fourthSectionMonsteraLeaves.play();
    } else if (this.activeFPIndex == 3) {
      anime({
        targets: "#hyacinth-5",
        easing: "easeInOutSine",
        delay: 0,
        duration: 500,
        opacity: 1,
        rotate: [130, 130],
        translateY: [0, -10],
      });

      this.activeAnimations.fifthSectionHyacinth.play();
    }
  }

  addClasses(nodeList, cssClasses) {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.add(...cssClasses);
    }
  }

  removeClasses(nodeList, cssClasses) {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.remove(...cssClasses);
    }
  }

  waitForIdle() {
    let wrapper = document.querySelector("#main-wrapper");
    let items = wrapper.querySelectorAll(".vslide");

    this.removeClasses(items, ["transition"]);
    this.handleNewFPSlideAnimation();

    //set timeout to make sure extra scrolls doesn't fire
    setTimeout(() => {
      this.idle = true;
    }, 500);
  }

  waitForFAQIdle() {
    //set timeout to make sure extra scrolls doesn't fire
    setTimeout(() => {
      this.idle = true;
    }, 500);
  }

  changeSlide(direction) {
    let wrapper = document.querySelector("#main-wrapper");
    let main = document.querySelector("#slides-main");
    let items = wrapper.querySelectorAll(".vslide");
    let total = items.length;

    let activeFPIndex = this.activeFPIndex;
    let previousDirection = wrapper.classList.contains("prev")
      ? "prev"
      : "next";
    let didChangeDirection = previousDirection !== direction;

    if (activeFPIndex == total - 1 && direction == "next") {
      return;
    } else if (activeFPIndex == 0 && direction == "prev") {
      return;
    }

    this.idle = false;
    wrapper.classList.remove("prev", "next");
    if (direction == "next") {
      activeFPIndex = (activeFPIndex + 1) % total;
      wrapper.classList.add("next");
    } else {
      activeFPIndex = (activeFPIndex - 1 + total) % total;
      wrapper.classList.add("prev");
    }

    //reset classes
    this.removeClasses(items, ["prev", "activeSlide", "next"]);

    //set prev
    const prevItems = [...items].filter((item) => {
      let prevIndex;
      if (wrapper.classList.contains("prev")) {
        prevIndex = activeFPIndex == total - 1 ? 0 : activeFPIndex + 1;
      } else {
        prevIndex = activeFPIndex == 0 ? total - 1 : activeFPIndex - 1;
      }

      return item.dataset.slideindex == prevIndex;
    });

    //set next
    const nextItems = [...items].filter((item) => {
      let nextIndex;
      if (wrapper.classList.contains("next")) {
        nextIndex = activeFPIndex == total + 1 ? 0 : activeFPIndex + 1;
      } else {
        nextIndex = activeFPIndex == 0 ? total + 1 : activeFPIndex - 1;
      }

      return item.dataset.slideindex == nextIndex;
    });

    //set active
    const activeItems = [...items].filter((item) => {
      return item.dataset.slideindex == activeFPIndex;
    });

    if (didChangeDirection) {
      //when changing directions, we need to add a transition class to smooth the css changes
      this.addClasses(nextItems, ["transition"]);
    }

    this.addClasses(prevItems, ["prev"]);

    this.addClasses(nextItems, ["next"]);

    this.addClasses(activeItems, ["activeSlide"]);

    const activeSlide = main.querySelector(".activeSlide");

    this.activeFPIndex = activeFPIndex;

    activeSlide.addEventListener("transitionend", this.waitForIdle.bind(this), {
      once: true,
    });
  }

  handleScroll(direction) {
    if (this.idle == true) {
      this.prepareForFPSlideChange();
      this.changeSlide(direction);
    }
  }

  prepareForFPSlideChange() {
    let wrapper = document.querySelector("#main-wrapper");

    if (this.activeFPIndex == 0) {
      this.activeAnimations.lily.pause();
      this.activeAnimations.quakingGrass.pause();
      this.activeAnimations.firstCarnation.pause();
      this.activeAnimations.firstHyacinth.pause();
      this.activeAnimations.firstChrysantheum.pause();
    } else if (this.activeFPIndex == 1) {
      this.activeAnimations.firstChrysantheum.pause();
      this.activeAnimations.secondSectionHyacinthes.pause();
      this.activeAnimations.fourthSectionCarnations.pause();
    } else if (this.activeFPIndex == 2) {
      //   this.activeAnimations.thirdSectionHyacinthes.pause();
      //   this.activeAnimations.thirdSectionMonsteraLeaves.pause();
      // } else if (this.activeFPIndex == 3) {
      this.activeAnimations.fourthSectionChrysantheum.pause();
      this.activeAnimations.fourthSectionMonsteraLeaves.pause();
    } else if (this.activeFPIndex == 3) {
      this.activeAnimations.fourthSectionCarnations.pause();
      this.activeAnimations.fifthSectionHyacinth.pause();
    }
    // if (this.activeFPIndex !== 4) {
    anime({
      targets: [".activeSlide .animated-content"],
      easing: "easeInOutSine",
      duration: 1000,
      opacity: 0,
      delay: 0,
    });
    // }
  }

  handleFAQSlide() {
    let wrapper = document.querySelector("#faq-wrapper");
    let main = document.querySelector("#faq-slides");
    let items = wrapper.querySelectorAll(".slide");
    let total = items.length;

    let activeFAQSlideIndex = this.activeFAQSlideIndex;
    let direction = "next";
    let previousDirection = wrapper.classList.contains("prev")
      ? "prev"
      : "next";
    let didChangeDirection = previousDirection !== direction;

    this.idle = false;
    wrapper.classList.remove("prev", "next");
    if (direction == "next") {
      activeFAQSlideIndex = (activeFAQSlideIndex + 1) % total;
      wrapper.classList.add("next");
    } else {
      activeFAQSlideIndex = (activeFAQSlideIndex - 1 + total) % total;
      wrapper.classList.add("prev");
    }

    //reset classes
    this.removeClasses(items, ["prev", "active", "next"]);

    //set prev
    const prevItems = [...items].filter((item) => {
      let prevIndex;
      if (wrapper.classList.contains("prev")) {
        prevIndex =
          activeFAQSlideIndex == total - 1 ? 0 : activeFAQSlideIndex + 1;
      } else {
        prevIndex =
          activeFAQSlideIndex == 0 ? total - 1 : activeFAQSlideIndex - 1;
      }

      return item.dataset.faqindex == prevIndex;
    });

    //set next
    const nextItems = [...items].filter((item) => {
      let nextIndex;
      if (wrapper.classList.contains("next")) {
        nextIndex =
          activeFAQSlideIndex == total + 1 ? 0 : activeFAQSlideIndex + 1;
      } else {
        nextIndex =
          activeFAQSlideIndex == 0 ? total + 1 : activeFAQSlideIndex - 1;
      }

      return item.dataset.faqindex == nextIndex;
    });

    //set active
    const activeItems = [...items].filter((item) => {
      return item.dataset.faqindex == activeFAQSlideIndex;
    });

    if (didChangeDirection) {
      this.addClasses(nextItems, ["transition"]);
    }

    this.addClasses(prevItems, ["prev"]);

    this.addClasses(nextItems, ["next"]);

    this.addClasses(activeItems, ["active"]);

    const activeSlide = main.querySelector(".active");

    this.activeFAQSlideIndex = activeFAQSlideIndex;

    activeSlide.addEventListener(
      "transitionend",
      this.waitForFAQIdle.bind(this),
      {
        once: true,
      }
    );
  }

  shouldRenderPostRecording = () => {
    return (
      this.state.padRecording.length > 0 &&
      !this.state.isRecording &&
      !this.state.shouldStartRecording &&
      !this.state.shouldStopRecording
    );
  };

  setOpenControls() {
    this.setState({ openControls: !this.state.openControls });
  }

  setHideBeatpad() {
    if (this.state.hideBeatpad) {
      anime({
        targets: [".gridOuter"],
        easing: "easeInOutSine",
        duration: 250,
        opacity: 1,
        delay: 0,
      });
      anime({
        targets: [".waterLoopVideo"],
        easing: "easeInOutSine",
        duration: 250,
        filter: "brightness(40%)",
        delay: 0,
      });
    } else {
      anime({
        targets: [".gridOuter"],
        easing: "easeInOutSine",
        duration: 250,
        opacity: 0,
        delay: 0,
      });
      anime({
        targets: [".waterLoopVideo"],
        easing: "easeInOutSine",
        duration: 250,
        filter: "brightness(100%)",
        delay: 0,
      });
    }
    this.setState({ hideBeatpad: !this.state.hideBeatpad });
  }

  setShowTutorial() {
    this.setState({
      showTutorial: !this.state.showTutorial,
      openControls: !this.state.openControls,
    });
  }

  calculateProgressPercentage = async () => {
    const totalDuration =
      this.state.endTotalRecordingTime - this.state.startRecordingTime;
    const scaledDuration = totalDuration * 1.3;
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    let currentMs = 0;
    while (currentMs * 1.3 <= scaledDuration) {
      if (
        this.state.exportingStatus &&
        this.state.exportingStatus.includes("Exporting, please wait...")
      ) {
        this.setState({
          exportingStatus: `Exporting, please wait... ${Math.floor(
            ((currentMs * 1.3) / scaledDuration) * 100
          )}%`,
        });
      }
      await wait(1000 * 1.3);
      currentMs += 1000;
    }
    //if loop ends and download hasn't commenced, show user the message below
    if (
      this.state.exportingStatus &&
      this.state.exportingStatus.includes("Exporting, please wait...")
    ) {
      this.setState({
        exportingStatus:
          "Exporting, please wait...100%. Your download will initiate soon",
      });
    }
  };

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
      provider,
      padFormat,
      padFormatStyleClass,
      padRecording,
      shareablePadNumbers,
      showTutorial,
      recordingTimer,
      tutorialStep,
      volume,
      openControls,
    } = this.state;

    const currentBidAmount =
      bids.length > 0
        ? parseFloat(utils.formatEther(bids[0].base_price)).toPrecision(4) / 1
        : 0;

    if (this.patch === undefined && this.cablesCanvas.current) {
      this.patch = new window.CABLES.Patch({
        patch: window.CABLES.exportedPatch,
        doRequestAnimation: true,
        clearCanvasColor: false,
        clearCanvasDepth: false,
        glCanvas: this.cablesCanvas.current,
        glCanvasResizeToWindow: false,
        prefixAssetPath: "/public/artists/oksami/garden/visualizer/",
        onError: function(e) {
          console.error("err", e);
        },
      });

      this.patch.config.didRender = this.didRender;
    }

    const renderPad = () => {
      const beatPads = [];
      const blooms = [];
      const bloomObject = { top: [], right: [], bottom: [], left: [] };

      {
        padFormat.map((column, j) => {
          return column.map((remappedCoordinates, i) => {
            const group = remappedCoordinates[0];
            const soundIndex = remappedCoordinates[1];
            const additionalClasses = remappedCoordinates[2]
              ? remappedCoordinates[2]
              : "";

            const on = this.players[group][soundIndex].state === "started";

            const blinkClass =
              pads[group][soundIndex] === 1 &&
              this.players[group][soundIndex].state !== "started"
                ? "blink"
                : "";
            const whiteClass = group === "sounds" ? "whitePad" : "";
            let tutorialClass = "";
            const padClass = group == "sounds" ? "padWhiteVersion" : "pad";

            if (showTutorial) {
              if (tutorialStep === 0 && group !== "drums") {
                tutorialClass = "tutorialPad";
              } else if (tutorialStep === 1 && group !== "basses") {
                tutorialClass = "tutorialPad";
              } else if (tutorialStep === 2 && group !== "sounds") {
                tutorialClass = "tutorialPad";
              }
            }

            if (padFormatStyleClass == "tile36" && j >= 6) {
              blooms.push(
                <div
                  key={`pad-group-${i}`}
                  className={`bloom ${cx(padClass, {
                    on,
                  })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
                  onClick={() => {
                    this.togglePad(group, soundIndex);
                  }}
                />
              );
            } else if (padFormatStyleClass == "tile25" && j >= 5) {
              blooms.push(
                <div
                  key={`pad-group-${i}`}
                  className={`bloom ${cx(padClass, {
                    on,
                  })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
                  onClick={() => {
                    this.togglePad(group, soundIndex);
                  }}
                />
              );
            } else {
              beatPads.push(
                <div
                  key={`pad-group-${i}`}
                  className={`${cx(padClass, {
                    on,
                  })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
                  onClick={() => {
                    this.togglePad(group, soundIndex);
                  }}
                />
              );
            }
          });
        });
      }

      var bloomOrder = 0;
      {
        blooms.map((bloom) => {
          if (bloomOrder <= 2) {
            bloomObject["top"].push(bloom);
          } else if (bloomOrder > 2 && bloomOrder <= 5) {
            bloomObject["bottom"].push(bloom);
          } else if (bloomOrder > 5 && bloomOrder <= 8) {
            bloomObject["right"].push(bloom);
          } else {
            bloomObject["left"].push(bloom);
          }
          if (bloomOrder < 11) {
            bloomOrder = bloomOrder + 1;
          } else {
            bloomOrder = 0;
          }
        });
      }

      return (
        <>
          <div className={`gridOuter blooming`}>
            <div className="bloom-group top">{bloomObject["top"]}</div>
            <div className="bloom-group right">
              <div className="bloom-content">{bloomObject["right"]}</div>
            </div>
            <div className="bloom-group left">
              <div className="bloom-content">{bloomObject["left"]}</div>
            </div>
            <div className="bloom-group bottom">{bloomObject["bottom"]}</div>
            <div className={`main-pad-group ${padFormatStyleClass}`}>
              {beatPads}
            </div>
          </div>
        </>
      );
    };

    // Set up active sounds limit
    if (nft && loaded) {
      const mediaFileExtension = nft.imageURL
        .split(".")
        .pop()
        .toLowerCase();

      return (
        <div id="main-wrapper">
          <div id="slideshow">
            <div id="slides-main">
              <div
                className="section vslide activeSlide"
                id="video-player-section"
                data-slideindex="0"
              >
                <FlowerArrangement />

                <Navbar
                  white={false}
                  didConnectWallet={this.initWallet}
                  loggedIntoMetamaskOverride={isLoggedIntoMetamask}
                />

                <div className="container">
                  {mediaFileExtension === "mp4" && (
                    <div className="video-container">
                      <video
                        className="waterLoopVideo"
                        playsInline
                        autoPlay
                        loop
                        muted
                        data-autoplay
                      >
                        <source src={nft.imageURL} type="video/mp4" />
                      </video>
                    </div>
                  )}
                  {mediaFileExtension !== "mp4" && (
                    <img className="waterLoopVideo" src={nft.imageURL} />
                  )}

                  <div className="gridTop">
                    {this.rhythmPads.map((group, groupIndex) => (
                      <React.Fragment>
                        {group.map((pad, i) => (
                          <div
                            key={`pad-group-${i}`}
                            className={cx("modifiedPad", {
                              active:
                                groupIndex ===
                                (((step - 1) % steps) + steps) % steps,
                              on: pad === 1,
                            })}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>

                  {renderPad()}

                  {/*
                    //WORK IN PROGRESS

                  <BouquetCarousel
                    padFormat={padFormat}
                    padFormatStyleClass={padFormatStyleClass}
                    players={this.players}
                    nfts={[nft, nft]}
                    rhythmPads={this.rhythmPads}
                    togglePad={this.togglePad.bind(this)}
                    step={step}
                    steps={steps}
                    pads={pads}
                    showTutorial={showTutorial}
                    tutorialStep={tutorialStep}
                  />

                  */}

                  <div className="song-info-wrapper">
                    {showTutorial && (
                      <div className="tutorial-wrapper">
                        <React.Fragment>
                          {tutorialStep === 0 && (
                            <React.Fragment>
                              <div className="body-small white-text">
                                To begin, press one of the highlighted squares
                                on the left. These are the drum loops. <br />
                                <br />
                                Only one will play at a time.
                              </div>
                            </React.Fragment>
                          )}
                          {tutorialStep === 1 && (
                            <div className="body-small white-text">
                              Now, press one of the highlighted squares on the
                              right. These are the bass loops. <br />
                              <br />
                              When the pad is flashing, the sound will wait to
                              play until the next bar.
                              <br />
                              <br /> Only one will play at a time.
                            </div>
                          )}
                          {tutorialStep === 2 && (
                            <div className="body-small white-text">
                              {`Lastly, press one of grey squares in the middle. These are
                          chords and melodies. Up to ${nft.activeSoundLimits["sounds"]} can play at at time.`}
                            </div>
                          )}
                          {tutorialStep === 3 && (
                            <div className="body-small white-text">
                              You're ready to make some music! <br />
                              <br />
                              Try out different combinations and share them with
                              friends below. <br />
                              <br />
                              If you'd like to learn more about Secret Garden,
                              scroll down.
                            </div>
                          )}
                        </React.Fragment>
                      </div>
                    )}
                    <div className="song-info-container">
                      {/* {openControls && (
                        <div className="controls-container">
                          <div className="record-container control-item">
                            <button
                              className={
                                this.state.shouldStartRecording ||
                                this.state.isRecording
                                  ? "button record blink whitePad padWhiteVersion"
                                  : "button record"
                              }
                              onClick={() => {
                                if (this.state.isRecording) {
                                  this.stopRecording();
                                } else {
                                  this.startRecording();
                                }
                              }}
                            >
                              <div className="circle"></div>
                              {this.state.isRecording
                                ? this.state.shouldStopRecording
                                  ? "Stopping"
                                  : "Stop Recording"
                                : "Record"}
                            </button>
                            {this.state.isRecording && (
                              <p className="body-medium yellow-text">
                                {this.state.recordingStatus}
                                {this.state.isRecording && <Stopwatch />}
                              </p>
                            )}
                          </div>
                          <button
                            className={"button record control-item"}
                            onClick={this.setHideBeatpad.bind(this)}
                          >
                            {this.state.hideBeatpad ? "Show Pad" : "Hide Pad"}
                          </button>
                          <button
                            className={"button record control-item"}
                            onClick={this.setShowTutorial.bind(this)}
                          >
                            {this.state.showTutorial
                              ? "Hide Tutorial"
                              : "Show Tutorial"}
                          </button>
                        </div>
                      )} */}

                      {openControls && (
                        <div className="controls-container">
                          <div className="record-container control-item">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width:
                                  this.state.recordingStatus.length > 0 ||
                                  this.state.exportingStatus.length > 0
                                    ? "100%"
                                    : "200px",
                              }}
                            >
                              {this.state.exportingStatus.length > 0 && (
                                <div
                                  style={{ marginRight: "10px" }}
                                  className="body-medium yellow-text"
                                >
                                  {this.state.exportingStatus}
                                </div>
                              )}
                              {this.shouldRenderPostRecording() ? (
                                <button
                                  className={
                                    this.state.exportingStatus.includes(
                                      "Exporting, please wait..."
                                    )
                                      ? "button disabled"
                                      : "button record"
                                  }
                                  style={{ marginRight: "10px" }}
                                  disabled={this.state.exportingStatus.includes(
                                    "Exporting, please wait..."
                                  )}
                                  onClick={() =>
                                    this.exportRecording(this.state.recording)
                                  }
                                >
                                  Export
                                </button>
                              ) : (
                                <div
                                  style={{ marginRight: "10px" }}
                                  className="body-medium yellow-text"
                                >
                                  {/* {this.state.exportingStatus ===
                                  "Exporting, please wait..."
                                    ? this.state.exportingStatus
                                    :  */}
                                  {this.state.recordingStatus}
                                  {this.state.isRecording && <Stopwatch />}
                                </div>
                              )}
                              {
                                <button
                                  className={
                                    this.state.shouldStartRecording ||
                                    this.state.isRecording
                                      ? "button record blink whitePad padWhiteVersion"
                                      : this.state.isPlayingBack ||
                                        this.state.repeat
                                      ? "button disabled"
                                      : "button record"
                                  }
                                  onClick={() => {
                                    if (this.state.isRecording) {
                                      this.stopRecording();
                                    } else {
                                      this.startRecording();
                                    }
                                  }}
                                  disabled={
                                    this.state.isPlayingBack ||
                                    this.state.repeat
                                  }
                                >
                                  <div className="circle" />
                                  {this.state.isRecording
                                    ? this.state.shouldStopRecording
                                      ? "Stopping"
                                      : "Stop Recording"
                                    : "Record"}
                                </button>
                              }
                              {/* {
                                <button
                                  onClick={this.calculateProgressPercentage()}
                                >
                                  click for logs
                                </button>
                              } */}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: this.state.hasNewRecording
                                  ? "space-between"
                                  : "flex-end",
                                alignItems: "center",
                                width: "200px",
                              }}
                            >
                              {
                                <button
                                  style={{
                                    visibility: this.shouldRenderPostRecording()
                                      ? "visible"
                                      : "hidden",
                                  }}
                                  className={
                                    this.state.padRecording.length <= 0 ||
                                    this.state.isRecording
                                      ? "button disabled"
                                      : "button record"
                                  }
                                  onClick={() => {
                                    if (!this.state.isPlayingBack) {
                                      this.playbackRecording(
                                        this.state.padRecording,
                                        (pad) => {
                                          this.togglePad(pad[0], pad[1]);
                                        }
                                      );
                                    } else {
                                      this.setState({
                                        isPlayingBack: false,
                                      });
                                      this.clearSelections();
                                    }
                                  }}
                                  disabled={
                                    this.state.padRecording.length <= 0 ||
                                    this.state.isRecording
                                  }
                                >
                                  {!this.state.isPlayingBack
                                    ? "Playback"
                                    : "Stop Playback"}
                                </button>
                              }
                            </div>
                          </div>
                          <button
                            className={"button record control-item"}
                            onClick={this.setHideBeatpad.bind(this)}
                          >
                            {this.state.hideBeatpad ? "Show Pad" : "Hide Pad"}
                          </button>
                          <button
                            className={"button record control-item"}
                            onClick={this.setShowTutorial.bind(this)}
                          >
                            {this.state.showTutorial
                              ? "Hide Tutorial"
                              : "Show Tutorial"}
                          </button>
                        </div>
                      )}

                      <div className="song-details">
                        {/* <p className="launchdate-text body-medium yellow-text">
                          LAUNCH AND REVEAL 5/24
                        </p> */}
                        <div className="beatPackTitle display-medium">
                          {nft.name}
                        </div>
                        <div className="artistName">{`by ${nft.artistName} ${
                          nft.visualArtistName
                            ? `& ${nft.visualArtistName}`
                            : ""
                        }`}</div>
                      </div>
                    </div>
                  </div>
                  <IconButton
                    className="expandOuter animated-content"
                    onClick={() => this.handleScroll("next")}
                  >
                    <img src={Expand} className="expand" />
                  </IconButton>
                  <div className="volumeMeter">
                    <canvas
                      ref={this.canvas}
                      style={{ minWidth: "75%", zIndex: "-10" }}
                    />
                  </div>
                </div>
              </div>

              <div className="section vslide next" data-slideindex="1">
                <Hyacinth id="hyacinth-2" className="hyacinth" />
                <Hyacinth
                  id="hyacinth-3"
                  className="hyacinth animated-content"
                />

                <div className="content-container" ref={this.myRef}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "84px",
                    }}
                  >
                    <Hyacinth
                      id="main-flower"
                      className="hyacinth animated-content"
                    />

                    <div>
                      <div>
                        <div className="section-intro-text animated-content">
                          WELCOME TO
                        </div>
                        <div className="packTitle animated-content display-medium yellow-text">
                          The Secret Garden
                        </div>
                        <div className="details animated-content body-medium light-yellow-text">
                          The Secret Garden seeds new species of immersive
                          audiovisual experiences.
                          <br />
                          Rediscover the experience of sound.
                        </div>
                        <br />
                        <br />
                        <IconButton
                          className="expandOuter animated-content"
                          onClick={() => this.handleScroll("next")}
                        >
                          <img src={Expand} className="expand" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="section vslide" data-slideindex="2">
                <Carnation id="carnation-3" className="carnation" />

                <MonsteraLeaf
                  id="leaf-2"
                  className="monstera-leaf animated-content"
                />

                <MonsteraLeaf
                  id="leaf-1"
                  className="monstera-leaf animated-content"
                />

                <Hyacinth
                  id="hyacinth-4"
                  className="hyacinth animated-content"
                />

                <div
                  className="content-container mobile-justify-top"
                  ref={this.myRef}
                >
                  <div>
                    <div>
                      <div className="section-intro-text animated-content">
                        BUT...
                      </div>
                      <div className="packTitle animated-content display-medium yellow-text">
                        There's a Gap
                      </div>
                      <div className="details animated-content body-medium light-yellow-text">
                        Digital art is breaking all time highs on a daily basis
                        while music is still underserved.
                      </div>
                      <div className="details animated-content body-medium light-yellow-text">
                        We are here to crack the code by pushing the boundaries
                        of art and NFTs.
                      </div>
                      <br />
                      <br />
                      <IconButton
                        className="expandOuter animated-content"
                        onClick={() => this.handleScroll("next")}
                      >
                        <img src={Expand} className="expand" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="section vslide" data-slideindex="2">
                <MonsteraLeaf
                  id="leaf-3"
                  className="monstera-leaf animated-content"
                />
                <Tulip className="tulip animated-content" />
                <Chrysanthemum
                  id="chrysanthemum-2"
                  className="chrysanthemum animated-content"
                />
                <Carnation id="carnation-2" className="carnation" />

                <div
                  className="content-container small mobile-justify-bottom"
                  ref={this.myRef}
                >
                  <div className="section-intro-text animated-content">
                    INTRODUCING
                  </div>
                  <div className="packTitle animated-content display-medium yellow-text">
                    Bouquet
                  </div>
                  <div className="details animated-content body-medium light-yellow-text text-center">
                    Bouquet is an interactive music player.
                  </div>
                  <div className="details animated-content body-medium light-yellow-text text-center">
                    The Bouquet NFT is the first music NFT that allows holders
                    to generate their own mix using unique sounds produced by
                    our resident artists.
                    <br />
                    <br />
                    <a
                      target="_blank"
                      className="cta-link"
                      href="https://opensea.io/collection/sunday-journal"
                    >
                      View on OpenSea
                    </a>
                  </div>
                  <br />
                  <IconButton
                    className="expandOuter animated-content"
                    onClick={() => this.handleScroll("next")}
                  >
                    <img src={Expand} className="expand" />
                  </IconButton>
                </div>
              </div>
              <div className="section vslide final" data-slideindex="3">
                <Hyacinth
                  id="hyacinth-5"
                  className="hyacinth animated-content"
                />

                <div className="content-container">
                  <div>
                    <div className="section-intro-text animated-content">
                      FAQS
                    </div>

                    <div id="faq-wrapper">
                      <div id="faq-slideshow">
                        <div id="faq-slides">
                          <div
                            className="slide active"
                            data-anchor="slide1"
                            data-faqindex="0"
                            ref={this.FAQ}
                          >
                            <div className="slide-wrapper">
                              <div>
                                <div className="packTitle animated-content display-medium yellow-text">
                                  What do I get by buying a Bouquet?
                                </div>
                                <div className="details animated-content body-medium light-yellow-text">
                                  - You can create your sound identity by
                                  recording and imprinting a mix right on your
                                  NFT.
                                  <br /> <br />
                                  - You can download a .wav file of every stem
                                  in your NFT.
                                  <br /> <br />
                                  - You receive a non-exclusive license to
                                  sample, make derivatives, and commercialize
                                  every sound and mix on your NFT, so long as
                                  you give full attribution and credit to the
                                  original musician (e.g. co-producer) and
                                  Secret Garden.
                                  <br /> <br />
                                  - You get access to the (secret) Secret
                                  Garden.
                                  <br /> <br />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="slide next"
                            data-anchor="slide2"
                            data-faqindex="1"
                            ref={this.FAQ}
                          >
                            <div className="slide-wrapper">
                              <div>
                                <div className="packTitle animated-content display-medium yellow-text">
                                  HOW CAN I SHARE MY BOUQUET?
                                </div>
                                <div className="details animated-content body-medium light-yellow-text">
                                  - Holders can download an .mp4 of their mix
                                  and share it anywhere they want.
                                  <br /> <br />
                                  - Holders can also display their actual
                                  Bouquet NFT with their imprinted mix and
                                  audiovisual experience anywhere that can
                                  display interactive code (e.g. Opensea).
                                  <br /> <br />- The Secret Garden may allow
                                  different versions of sharing in the future.
                                  We’ll let you know when!
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="slide"
                            data-anchor="slide3"
                            data-faqindex="2"
                            ref={this.FAQ}
                          >
                            <div className="slide-wrapper">
                              <div>
                                <div className="packTitle animated-content display-medium yellow-text">
                                  How do I purchase a Bouquet?
                                </div>
                                <div className="details animated-content body-medium light-yellow-text">
                                  Drops will occur on this site on mint days,
                                  which will be announced on Discord and
                                  Twitter. You may also purchase Secret Garden
                                  NFTs on secondary marketplaces like Opensea.
                                  Follow us on{" "}
                                  <a
                                    target="_blank"
                                    href="https://twitter.com/SecretGarden_FM"
                                  >
                                    Twitter
                                  </a>{" "}
                                  to stay up to date!
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <IconButton
                      className="expandOuter animated-content float-right"
                      onClick={() => this.handleFAQSlide()}
                    >
                      <img src={ArrowRight} className="expand" />
                    </IconButton>
                  </div>
                </div>
              </div>

              <div
                className="section vslide"
                data-slideindex="4"
                ref={this.FAQ}
              >
                <div className="slideshow-footer-container" ref={this.myRef}>
                  <div>
                    {/* <div className="privacyAndTos"> */}
                    <div className="details animated-content slide-footer">
                      <div>
                        <a
                          className="body-medium light-yellow-text"
                          href="mailto:inquiries@secretgarden.fm"
                        >
                          inquiries@secretgarden.fm
                        </a>
                      </div>
                      <div className="legal-links">
                        <a className="body-medium" target="_blank">
                          Kyber Corp.
                        </a>
                        <a className="body-medium" target="_blank">
                          Yokai House Inc.
                        </a>
                        <a
                          className="body-medium"
                          href="https://secretgarden.nyc3.digitaloceanspaces.com/Terms%20Of%20Service%204.19.22.pdf"
                          target="_blank"
                        >
                          Terms of Service
                        </a>

                        <a
                          className="body-medium"
                          href="/privacy"
                          target="_blank"
                        >
                          Privacy Policy
                        </a>
                      </div>
                    </div>
                    {/* <div className="ourSocials"> */}
                    <div className="details animated-content"></div>
                  </div>
                </div>
              </div>

              <Footer
                white={false}
                shareURL={`https://secretgarden.fm/?share=${shareablePadNumbers.join(
                  ","
                )}`}
                showShare={true}
                loggedIntoMetamaskOverride={isLoggedIntoMetamask}
                muiTheme={this.muiTheme}
                setVolume={this.setVolume.bind(this)}
                volume={this.state.volume}
                clearSelections={this.clearSelections}
                handleShuffle={this.handleShuffle}
                canvas={this.canvas}
                playing={this.state.playing}
                setOpenControls={this.setOpenControls.bind(this)}
                openControls={openControls}
              />
            </div>
          </div>
        </div>
      );
    }

    return <Loading />;
  }
}

export default withWeb3HOC(Sequencer);
