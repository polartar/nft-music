/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef } from "react";
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

import Slider from "@material-ui/core/Slider";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import anime from 'animejs/lib/anime.es.js';
import Lily from "./components/Lily";
import Chrysanthemum from "./components/Chrysanthemum";
import Hyacinth from "./components/Hyacinth";
import Carnation from "./components/Carnation";
import QuakingGrass from "./components/QuakingGrass";
import MonsteraLeaf from "./components/MonsteraLeaf";
import Tulip from "./components/Tulip";


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

const pluginWrapper = () => {
  require("./fullpage.fadingEffect.min");
};


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
    timer: 0,
    recordingStatus: "",
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
    this.activeIndex = 0;
    this.activeFAQSlideIndex = 0;
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
  touchStart = function (e) {
    this.mobileTouchStart = parseInt(e.changedTouches[0].clientX)
    window.scrollTop = 0;
  }

  touchMove = function (e) {
    let idle = this.idle

    let mobileTouchMove = parseInt(e.changedTouches[0].clientX);

    console.log("TOUCH START IS " + this.mobileTouchStart + " TOUCH END IS " + mobileTouchMove)

    const delta = mobileTouchMove - this.mobileTouchStart;
    window.scrollTop = 0;
    if (delta == 0) {
      //user tapped, don't do anything
      return
    }
    console.log("DELTA IS " + delta)
    if (idle) {

        const direction = delta > 0 ? 'next' : 'prev';
        this.changeSlide(direction);
    }
  }


  touchControl = () => {
    let hero = document.querySelector('#main-wrapper')

      hero.addEventListener('touchstart', this.touchStart.bind(this));
      hero.addEventListener('touchend', this.touchMove.bind(this));
  }

  handleInitialAnimations = () => {
    let el = document.querySelector("#main-wrapper")
    el.addEventListener('wheel', e => {this.handleScroll(e)});
    this.touchControl()
      anime({
        targets: ['.video-container', '.beatPackTitle', '.artistName', '.gridOuter'],
        easing: 'easeInOutSine',
        duration: 750,
        opacity:1,
        delay: 1000,
      });

      anime({
        targets: ['.play-controls', '.learnMore'],
        easing: 'easeInOutSine',
        duration: 750,
        opacity:1,
        delay: 2000,
      });

      this.handleVideoPlayerBackgroundAnimations()
  }

  handleVideoPlayerBackgroundAnimations = () => {
    anime({
      targets: '#video-player-section .lily path',
      easing: 'easeInOutSine',
      duration: 1200,
      skewX: function() {
        return anime.random(0.5, 1);
      },
      skewY: function() {
        return anime.random(-0.25, -0.75);
      },
      delay: 250,
      direction: 'alternate',
      loop: true
    });

    anime({
      targets: '.quaking-grass path',
      easing: 'easeInOutSine',
      duration: 1200,
      skewX: 0.8,
      skewY: -0.75,
      delay: 250,
      direction: 'alternate',
      loop: true
    });

    anime({
      targets: '.carnation path',
      easing: 'easeInOutSine',
      duration: 1300,
      skewX: 0.7,
      skewY: -0.6,
      delay: 250,
      direction: 'alternate',
      loop: true
    });

    anime({
      targets: '.hyacinth path',
      easing: 'easeInOutSine',
      duration: 1500,
      skewX: 0.6,
      skewY: -0.5,
      delay: 250,
      direction: 'alternate',
      loop: true
    });


    anime({
      targets: '.chrysanthemum path',
      easing: 'easeInOutSine',
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: 'alternate',
      loop: true
    });

    anime({
      targets: '.tulip #petals',
      easing: 'easeInOutSine',
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: 'alternate',
      loop: true
    });

    anime({
      targets: '.monstera-leaf path',
      easing: 'easeInOutSine',
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: 'alternate',
      loop: true
    });

    anime({
      targets: ['#video-player-section .lily', '#video-player-section .quaking-grass', '#video-player-section .carnation', '#video-player-section .hyacinth', '#video-player-section .chrysanthemum'],
      easing: 'easeInOutSine',
      duration: 500,
      opacity:1,
      delay: 0,
    });

  }

  exportRecording = async (blob) => {
    try {
      const form = new FormData();

      form.append("video", blob);
      form.append("artistName", this.state.nft.artistName);
      form.append("nftName", this.state.nft.name);
      form.append("edition", this.state.nft.edition);

      const response = await axios.post("/api/exportRecording", form, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" })
      );
      const anchor = document.createElement("a");
      anchor.download = `My Mix of ${this.state.nft.name}.mp4`;
      anchor.href = url;
      anchor.click();

      this.setState({
        recordingStatus: "",
      });
    } catch (error) {
      console.log(error);
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
            tutorialStep: updatedTutorialStep,
          });
        }

        if (this.state.step === 0) {
          if (this.state.shouldStartRecording) {
            this.recorder.start();

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
            this.exportRecording(recording);

            this.setState({
              shouldStopRecording: false,
              isRecording: false,
              recordingStatus: "Exporting...",
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

            _this.handleInitialAnimations()
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

    const milliseconds = cloneDeep(this.state.timer);

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

        const pressedPad = [group, pad];
        this.state.padFormat.forEach((column, j) => {
          column.forEach((mappedPad, i) => {
            if (
              mappedPad[0] === pressedPad[0] &&
              mappedPad[1] === pressedPad[1]
            ) {
              this.setState({
                padRecording: [
                  ...this.state.padRecording,
                  [j * this.state.padFormat.length + i, milliseconds],
                ],
              });
            }
          });
        });
        console.log(
          "this.state.padFormat.length: ",
          this.state.padFormat.length
        );

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
    this.setState({
      shouldStartRecording: true,
      recordingStatus: "Waiting for next loop to start...",
    });
    let milliseconds = 0;

    const incrementMilliseconds = () => {
      this.setState({
        timer: (milliseconds += 10),
      });
    };

    window.timer = setInterval(incrementMilliseconds, 10);
  }

  async stopRecording() {
    console.log("stopped recording");
    clearInterval(window.timer);

    this.setState({
      shouldStopRecording: true,
      recordingStatus: "Waiting for loop to end...",
      timer: 0,
    });
  }
  w1;

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

  clearSelections() {
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

  stopButton() {
    return (
      <div className="stopBtnWrapper">
        <IconButton className="expandOuter">
          <StopCircleIcon fontSize="large" onClick={this.clearSelections} />
        </IconButton>
      </div>
    );
  }

  volumeControl() {
    return (
      <div className="volumeWrapper">
        <ThemeProvider theme={this.muiTheme}>
          <Slider
            orientation="vertical"
            min={-50}
            max={0}
            defaultValue={this.state.volume}
            onChange={(event, newValue) => this.setVolume(newValue)}
          />
        </ThemeProvider>
      </div>
    );
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevState.activeIndex !== this.activeIndex) {
  //     //handle FP Slide change
  //     if (prevprevState.activeIndex == 1 && this.activeIndex == 0) {
  //
  //     }
  //   }
  // }


  onEnterViewport() {
    if (this.activeIndex == 0) {
      // this.handleVideoPlayerBackgroundAnimations()
    } else if (this.activeIndex == 1) {
      let hero = document.querySelector('#main-wrapper')
      if (hero.classList.contains("prev")) {
        // scrolled into from slide 2, dont need to cancel slide 1 animatinos
      } else {
          // anime.remove('#video-player-section path')
      }

      anime({
        targets: '#hyacinth-2',
        easing: 'easeInOutSine',
        delay: 0,
        duration: 500,
        opacity: [0, 1],
        translateX: 25,
        translateY: [0, -10],
        rotate:[45, 45]
      });

      anime({
        targets: '#hyacinth-3',
        easing: 'easeInOutSine',
        delay: 50,
        duration: 500,
        opacity: [0, 1],
        translateX: -50,
        translateY: [0, -10],
        rotate:[-30, -30]
      });

      anime({
        targets: '#main-flower',
        easing: 'easeOutQuad',
        delay: 100,
        duration: 500,
        opacity: [0, 1],
        translateY: [0, -10]
      });
    } else if (this.activeIndex == 2) {

        anime({
          targets: '#leaf-1',
          easing: 'easeInOutSine',
          delay: 100,
          duration: 500,
          opacity: [0, 1],
          // translateX: 25,
          translateY: ["-50%", "-51%"],

          rotate:[-10, -10]
        });

        anime({
          targets: '#leaf-2',
          easing: 'easeInOutSine',
          delay: 50,
          duration: 500,
          opacity: [0, 1],
          // translateX: -50,
          rotate:[-5, -5],
          translateY: [0, -10]
        });
        anime({
          targets: '#hyacinth-4',
          easing: 'easeInOutSine',
          delay: 50,
          duration: 500,
          opacity: [0, 1],
          // translateX: -50,
          rotate:[200, 200],
          translateY: [0, -10]
        });

        anime({
          targets: '#carnation-3',
          easing: 'easeInOutSine',
          delay: 0,
          duration: 500,
          opacity: [0, 1],
          // translateX: -50,
          rotate:[-30, -30],
          translateY: [0, -10]
        });

        anime({
          targets: '#main-flower',
          easing: 'easeInOutSine',
          delay: 0,
          duration: 500,
          opacity: [1, 0],
        });

      } else if (this.activeIndex == 3) {
          anime({
            targets: '#leaf-3',
            easing: 'easeInOutSine',
            delay: 0,
            duration: 500,
            opacity: [0, 1],
            // translateX: 25,
            rotate:[200, 200],
            translateY: [0, -10]

          });

          anime({
            targets: '#chrysanthemum-2',
            easing: 'easeInOutSine',
            delay: 50,
            duration: 500,
            opacity: [0, 1],
            // translateX: -50,
            rotate:[-30, -30],
            translateY: [0, -10]

          });

          anime({
            targets: '#carnation-2',
            easing: 'easeInOutSine',
            delay: 100,
            duration: 500,
            opacity: [0, 1],
            // translateX: -50,
            rotate:[-30, -30],
            translateY: [0, -10]

          });

          anime({
            targets: '.tulip',
            easing: 'easeInOutSine',
            delay: 100,
            duration: 500,
            opacity: [0, 1],
            // translateX: -50,
            translateY: [0, -10]

          });

          anime({
            targets: '#hyacinth-4',
            easing: 'easeInOutSine',
            delay: 0,
            duration: 500,
            opacity: [1, 0],
          });

        } else if (this.activeIndex == 4) {
            anime({
              targets: '#hyacinth-5',
              easing: 'easeInOutSine',
              delay: 0,
              duration: 500,
              opacity: [0, 1],
              // translateX: 25,
              rotate:[130, 130],
              translateY: [0, -10]
            });

          }

          anime({
            targets: [".section-intro-text"],
            easing: 'easeInOutSine',
            delay: 0,
            duration: 500,
            opacity: [0, 1],
            translateY: [0, -10]
          });

          anime({
            targets: [".packTitle"],
            easing: 'easeInOutSine',
            delay: 100,
            duration: 500,
            opacity: [0, 1],
            translateY: [0, -10]
          });

          anime({
            targets: [".details"],
            easing: 'easeInOutSine',
            delay: 200,
            duration: 500,
            opacity: [0, 1],
            translateY: [0, -10]

          });
}

mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
      console.log("set to idle")
      //set timeout to make sure extra scrolls doesn't fire
      let hero = document.querySelector('#main-wrapper')
      let items = hero.querySelectorAll('.vslide');
      this.removeClasses(items, ['transition']);

      setTimeout(() => {this.idle = true}, 500);


   }

    changeSlide(direction) {
        let hero = document.querySelector('#main-wrapper')
        let main = document.querySelector('#slides-main')
        let items = hero.querySelectorAll('.vslide');
        let total = items.length;

        let activeIndex = this.activeIndex
        let previousDirection = hero.classList.contains("prev") ? "prev" : "next"
        let didChangeDirection = previousDirection !== direction
        console.log("did change direction? " + didChangeDirection)


        console.log("current slide # " + activeIndex + " with " + total + " total slides")
        if (activeIndex == total - 1 && direction == 'next') {
          console.log("at the end")
          return
        } else if (activeIndex == 0 && direction == 'prev') {
          console.log("at the start")
          return
        }

        this.idle = false
        hero.classList.remove('prev', 'next');
        if (direction == 'next') {
            activeIndex = (activeIndex + 1) % total
            hero.classList.add('next');
        } else {

            activeIndex = (activeIndex - 1 + total) % total
            hero.classList.add('prev');
        }

        //reset classes
        this.removeClasses(items, ['prev', 'activeSlide', 'next']);

        //set prev
        const prevItems = [...items]
            .filter(item => {
                let prevIndex;
                if (hero.classList.contains('prev')) {
                    prevIndex = activeIndex == total - 1 ? 0 : activeIndex + 1;
                } else {
                    prevIndex = activeIndex == 0 ? total - 1 : activeIndex - 1;
                }
                console.log("prev index is " + prevIndex)


                return item.dataset.index == prevIndex;
            });

        //set next
        const nextItems = [...items]
            .filter(item => {
                let nextIndex;
                if (hero.classList.contains('next')) {
                    nextIndex = activeIndex == total + 1 ? 0 : activeIndex + 1;
                } else {
                    nextIndex = activeIndex == 0 ? total + 1 : activeIndex - 1;
                }

                console.log("next index is " + nextIndex)
                return item.dataset.index == nextIndex;
            });

        //set active
        const activeItems = [...items]
            .filter(item => {
                return item.dataset.index == activeIndex;
            });

            if (didChangeDirection) {
              this.addClasses(nextItems, ['transition']);
            }

        this.addClasses(prevItems, ['prev']);

        this.addClasses(nextItems, ['next']);

        this.addClasses(activeItems, ['activeSlide']);


        const activeImageItem = main.querySelector('.activeSlide');

        this.activeIndex = activeIndex
        console.log("activeIndex " + activeIndex)

        activeImageItem.addEventListener('transitionend', this.waitForIdle.bind(this), {
            once: true
        });
    }

handleScroll(e) {
  e.preventDefault()
  const direction = e.deltaY > 0 ? 'next' : 'prev';
  if (this.idle == true) {
    this.changeSlide(direction);
  }

  this.onEnterViewport()
}

onExitViewport() {

}

handelFAQSlide () {

  // let activeFAQSlideIndex = this.state.activeFAQSlideIndex
  // let nextFAQSlideIndex = activeFAQSlideIndex + 1
  // let hero = document.querySelector('#faq-wrapper')
  // let items = hero.querySelectorAll('.slide');
  // let total = items.length;
  //
  // console.log(nextFAQSlideIndex)
  // var slide = document.querySelector('.slide');
  //
  // let translateX = 800
  // // let translateX = anime.get(slide, 'width', 'px')
  // // console.log("Slide will be moved " + translateX)
  // if (activeFAQSlideIndex > 0 && activeFAQSlideIndex < total - 1) {
  //   translateX = translateX * (activeFAQSlideIndex + 1)
  // } else if (activeFAQSlideIndex == total - 1) {
  //   //reset
  //   translateX = 0
  //   nextFAQSlideIndex = 0
  // }
  // anime({
  //   targets: '.slide',
  //   easing: 'easeOutQuad',
  //   translateX: -translateX
  // });
  //
  // this.setState({activeFAQSlideIndex: nextFAQSlideIndex})

  let wrapper = document.querySelector('#faq-wrapper')
  let main = document.querySelector('#faq-slides')
  let items = wrapper.querySelectorAll('.slide');
  let total = items.length;
  console.log("faq slides total " + total)
  let activeIndex = this.activeFAQSlideIndex
  let direction = "next"
  let previousDirection = wrapper.classList.contains("prev") ? "prev" : "next"
  let didChangeDirection = previousDirection !== direction
  console.log("did change direction? " + didChangeDirection)


  console.log("current slide # " + activeIndex + " with " + total + " total slides")
  // if (activeIndex == total - 1 && direction == 'next') {
  //   console.log("at the end")
  //   return
  // } else if (activeIndex == 0 && direction == 'prev') {
  //   console.log("at the start")
  //   return
  // }

  this.idle = false
  wrapper.classList.remove('prev', 'next');
  if (direction == 'next') {
      activeIndex = (activeIndex + 1) % total
      wrapper.classList.add('next');
  } else {

      activeIndex = (activeIndex - 1 + total) % total
      wrapper.classList.add('prev');
  }

  //reset classes
  this.removeClasses(items, ['prev', 'active', 'next']);

  //set prev
  const prevItems = [...items]
      .filter(item => {
          let prevIndex;
          if (wrapper.classList.contains('prev')) {
              prevIndex = activeIndex == total - 1 ? 0 : activeIndex + 1;
          } else {
              prevIndex = activeIndex == 0 ? total - 1 : activeIndex - 1;
          }
          console.log("prev faq index is " + prevIndex)


          return item.dataset.index == prevIndex;
      });

  //set next
  const nextItems = [...items]
      .filter(item => {
          let nextIndex;
          if (wrapper.classList.contains('next')) {
              nextIndex = activeIndex == total + 1 ? 0 : activeIndex + 1;
          } else {
              nextIndex = activeIndex == 0 ? total + 1 : activeIndex - 1;
          }

          console.log("next faq index is " + nextIndex)
          return item.dataset.index == nextIndex;
      });

  //set active
  const activeItems = [...items]
      .filter(item => {
          return item.dataset.index == activeIndex;
      });

      if (didChangeDirection) {
        this.addClasses(nextItems, ['transition']);
      }

  this.addClasses(prevItems, ['prev']);

  this.addClasses(nextItems, ['next']);

  this.addClasses(activeItems, ['active']);


  const activeImageItem = main.querySelector('.active');

  this.activeFAQSlideIndex = activeIndex
  console.log("activeFAQSlideIndex " + activeIndex)
  console.log(activeItems)

  activeImageItem.addEventListener('transitionend', this.waitForIdle.bind(this), {
      once: true
  });
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
      provider,
      padFormat,
      padFormatStyleClass,
      padRecording,
      shareablePadNumbers,
      showTutorial,
      timer,
      tutorialStep,
      volume,
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

                <div className="section vslide activeSlide" id="video-player-section" data-index="0">
                <Lily/>
                <Carnation/>
                <Chrysanthemum/>
                <Hyacinth/>
                <QuakingGrass/>

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
                    <Navbar
                      white={false}
                      didConnectWallet={this.initWallet}
                      loggedIntoMetamaskOverride={isLoggedIntoMetamask}
                    />
                    <div className="bodyWrapper scrollBar">
                      <div className="beatPackTitle">{nft.name}</div>
                      <div className="artistName">{`by ${nft.artistName} ${
                        nft.visualArtistName ? `& ${nft.visualArtistName}` : ""
                      }`}</div>
                      <div className={`gridOuter ${padFormatStyleClass}`}>
                        {padFormat.map((column, j) => {
                          return column.map((remappedCoordinates, i) => {
                            const group = remappedCoordinates[0];
                            const soundIndex = remappedCoordinates[1];
                            const additionalClasses = remappedCoordinates[2]
                              ? remappedCoordinates[2]
                              : "";

                            const on =
                              this.players[group][soundIndex].state ===
                              "started";

                            const blinkClass =
                              pads[group][soundIndex] === 1 &&
                              this.players[group][soundIndex].state !==
                                "started"
                                ? "blink"
                                : "";
                            const whiteClass =
                              group === "sounds" ? "whitePad" : "";
                            let tutorialClass = "";
                            const padClass =
                              group == "sounds" ? "padWhiteVersion" : "pad";

                            if (showTutorial) {
                              if (tutorialStep === 0 && group !== "drums") {
                                tutorialClass = "tutorialPad";
                              } else if (
                                tutorialStep === 1 &&
                                group !== "basses"
                              ) {
                                tutorialClass = "tutorialPad";
                              } else if (
                                tutorialStep === 2 &&
                                group !== "sounds"
                              ) {
                                tutorialClass = "tutorialPad";
                              }
                            }

                            return (
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
                          });
                        })}
                      </div>
                      {showTutorial && (
                        <React.Fragment>
                          {tutorialStep === 0 && (
                            <React.Fragment>
                              <div className="currentBid tile25 tutorialStep">
                                The Secret Garden.
                              </div>
                              <div className="tutorialInfo">
                                To begin, press one of the highlighted squares
                                on the left. These are the drum loops. <br />
                                Only one will play at a time.
                              </div>
                            </React.Fragment>
                          )}
                          {tutorialStep === 1 && (
                            <div className="tutorialInfo tutorialFormatting">
                              Now, press one of the highlighted squares on the
                              right. These are the bass loops. <br />
                              When the pad is flashing, the sound will wait to
                              play until the next bar.
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
                              Try out different combinations and share them with
                              friends below. <br />
                              If you'd like to learn more about Secret Garden,
                              scroll down.
                            </div>
                          )}
                        </React.Fragment>
                      )}
                      {(tutorialStep === 3 || !showTutorial) && (
                        <React.Fragment>
                          <div className="learnMore" id="learnMore" style={{opacity:0}}>
                            <div className="ethAmount">Learn More</div>
                            <IconButton
                              className="expandOuter"
                              onClick={() => this.changeSlide("next")}
                            >
                              <img src={Expand} className="expand" />
                            </IconButton>
                          </div>
                        </React.Fragment>
                      )}

                      <div
                        className="play-controls"
                        style={{
                          display: "flex",
                          // flexDirection: "column",
                          justifyContent: "space-between",
                          marginLeft: "20px",
                          position: "absolute",
                          bottom: "60px",
                          width: "100vw",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="volumeContainer">
                            {this.volumeControl()}
                          </div>
                          <div className="stopBtnContainer">
                            {this.stopButton()}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "flex-end",
                            marginLeft: "10px",
                            marginRight: "10px",
                            width: "100%",
                          }}
                        >
                          <button
                            className={
                              this.state.shouldStartRecording ||
                              this.state.isRecording
                                ? "button blink whitePad padWhiteVersion"
                                : "button"
                            }
                            style={{
                              height: "40px",
                              width: "125px",
                              border: "none",
                              borderRadius: "5px",
                              margin: "5px",
                              // position: "absolute",
                              // bottom: "3px",
                              // left: "100px"
                            }}
                            onClick={() => {
                              if (this.state.isRecording) {
                                this.stopRecording();
                              } else {
                                this.startRecording();
                              }
                            }}
                          >
                            {this.state.isRecording
                              ? this.state.shouldStopRecording
                                ? "Stopping"
                                : "Stop Recording"
                              : "Record"}
                          </button>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "40px",
                              margin: "5px",
                              color: "white",
                            }}
                          >
                            {this.state.recordingStatus}
                          </div>
                        </div>
                        <div className="volumeMeter">
                          <canvas
                            ref={this.canvas}
                            style={{ minWidth: "75%", zIndex: "-10" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="section vslide next" id="content-section-1"  data-index="1">

                    <Hyacinth id="hyacinth-2"/>
                    <Hyacinth id="hyacinth-3"/>

                    <div className="content-container" ref={this.myRef}>
                    <div style={{display:"flex", justifyContent: "center", alignItems:"center", gap: "84px"}}>
                    <Hyacinth id="main-flower"/>

                      <div>
                        <div>
                      <div className="section-intro-text">
                      WELCOME TO
                      </div>
                        <div className="packTitle">
                          The Secret Garden
                        </div>
                        <div className="details">
                          We believe that Web3 can fundamentally unlock value
                          for all artists.
                        </div>
                        <br />
                        <br />
                        <IconButton
                          className="expandOuter"
                          onClick={() => this.changeSlide("next")}
                        >
                          <img src={Expand} className="expand" />
                        </IconButton>
                      </div>
                    </div>
                    </div>

                    </div>


                </div>

                <div className="section vslide"  data-index="2">
                <Carnation id="carnation-3"/>

                <MonsteraLeaf id="leaf-2"/>

                <MonsteraLeaf id="leaf-1"/>

                <Hyacinth id="hyacinth-4"/>

                  <div className="content-container" ref={this.myRef}>

                    <div>
                      <div>
                      <div className="section-intro-text">
                      BUT...
                      </div>
                        <div className="packTitle">There's a Gap</div>
                        <div className="details">
                          Digital art is breaking all time highs on a daily
                          basis while music is still underserved.
                        </div>
                        <div className="details">
                          We are here to crack the code by pushing the
                          boundaries of art and NFTs.
                        </div>
                        <br />
                        <br />
                        <IconButton
                          className="expandOuter"
                          onClick={() => this.changeSlide("next")}
                        >
                          <img src={Expand} className="expand" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section vslide" data-index="3">
                <MonsteraLeaf id="leaf-3"/>
                <Tulip/>
                <Chrysanthemum id="chrysanthemum-2"/>
                <Carnation id="carnation-2"/>

                  <div className="content-container small" ref={this.myRef}>

                      <div className="section-intro-text">INTRODUCING</div>
                        <div className="packTitle">Bouquet</div>
                        <div className="details" style={{textAlign:"center"}}>
                          Bouquet is a music NFT that forms an interactive music
                          player.
                        </div>
                        <div className="details" style={{textAlign:"center"}}>
                          The Bouquet NFT is the first music NFT that allows
                          holders to generate their own mix using unique sounds
                          produced by our resident artists.
                          <br />
                          <br />
                          <a
                            target="_blank"
                            className="cta-link"
                            href="https://testnets.opensea.io/assets/0x52b1dd5c27705aa4dfd3889db223b5c4c84f6b54/1"
                          >
                            View on OpenSea
                          </a>
                        </div>
                        <br />
                        <br />
                        <IconButton
                          className="expandOuter"
                          onClick={() => this.changeSlide("next")}
                        >
                          <img src={Expand} className="expand" />
                        </IconButton>
                      </div>

                </div>
                <div className="section vslide" data-index="4">
                <Hyacinth id="hyacinth-5"/>

                <div className="content-container">
                <div>
                <div className="section-intro-text">FAQS</div>

                <div id="faq-wrapper">
                <div id="faq-slideshow">

                <div id="faq-slides">


                  <div className="slide active" data-anchor="slide1" data-index="0" ref={this.FAQ}>

                      <div className="slide-wrapper">
                        <div>
                          <div className="packTitle">
                            What do I get by buying a Bouquet?
                          </div>
                          <div className="details">
                            When you purchase a Bouquet, you get to own this
                            one-of-a-kind interactive, playable experience as an
                            NFT.
                            <br /> <br />
                            The experience is fully functional, even on OpenSea:{" "}
                            <br /><br />
                            <a
                              className="cta-link"
                              target="_blank"
                              href="https://testnets.opensea.io/assets/0x52b1dd5c27705aa4dfd3889db223b5c4c84f6b54/1"
                            >
                              View on OpenSea
                            </a>
                          </div>
                        </div>
                      </div>


                  </div>
                  <div className="slide next" data-anchor="slide2" data-index="1" ref={this.FAQ}>

                      <div className="slide-wrapper">
                      <div>
                        <div className="packTitle">
                        Bonus Features:
                        </div>
                        <div className="details">
                          <ul>
                            <li>
                            Set the default mix for the player.
                            </li>
                            <li>
                            Receive a non-exclusive license to every sound file
                            on the player for personal or commercial use.
                            </li>
                            <li>
                            Access an exclusive holders channel on our Secret
                            Garden Discord.
                            </li>
                            <li>
                            Access to additional utility such as concert
                            tickets, meet and greets, merch, and more (will vary
                            per artist).
                            </li>
                          </ul>

                        </div>
                        </div>


                    </div>
                  </div>
                  <div className="slide" data-anchor="slide3" data-index="2" ref={this.FAQ}>

                      <div className="slide-wrapper">
                        <div>
                          <div className="packTitle">
                            How do I purchase a Bouquet?
                          </div>
                          <div className="details">
                            Join our{" "}
                            <a
                              target="_blank"
                              href="https://discord.gg/ykrzXB9ZsV"
                            >
                              Discord
                            </a>{" "}
                            or follow us on{" "}
                            <a
                              target="_blank"
                              href="https://twitter.com/SecretGarden_FM"
                            >
                              Twitter
                            </a>{" "}
                            to get notified when a new Bouquet drops.
                            <br />
                          </div>
                        </div>
                      </div>

                  </div>
                  </div>


                  </div>

                  </div>
                  <IconButton
                    style={{float:"right"}}
                    className="expandOuter"
                    onClick={() => this.handelFAQSlide()}
                  >
                    <img src={ArrowRight} className="expand" />
                  </IconButton>
                </div>

                </div>

                </div>

                <div className="section vslide" data-index="5" ref={this.FAQ}>
                  <div className="container2" ref={this.myRef}>
                    <div className="albumWrapper">
                      <div>
                        {/* <div className="privacyAndTos"> */}
                        <div className="details">
                          <div>
                            <a href="/tos" target="_blank">
                              Terms of Service
                            </a>
                          </div>
                          <div>
                            <a href="/privacy" target="_blank">
                              Privacy Policy
                            </a>
                          </div>
                        </div>
                        {/* <div className="ourSocials"> */}
                        <div className="details">
                          <span>inquiries@secretgarden.fm</span>
                          <a
                            href="https://twitter.com/SecretGarden_FM"
                            target="_blank"
                          >
                            <img src={Twitter} className="ourTwitter" />
                          </a>

                          <a
                            href="https://discord.gg/ykrzXB9ZsV"
                            target="_blank"
                          >
                            <img src={Discord} className="ourDiscord" />
                          </a>
                          <a
                            href="https://www.instagram.com/secretgarden_fm/"
                            target="_blank"
                          >
                            <img src={Instagram} className="ourInsta" />
                          </a>
                        </div>
                      </div>
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
                />
                </div>
                </div>

                </div>
 );
}

return <Loading />;
  }
}

export default Sequencer;
