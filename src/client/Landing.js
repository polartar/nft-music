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
    ["basses", 3]
  ],
  [
    ["sounds", 2],
    ["sounds", 3],
    ["sounds", 4],
    ["basses", 4],
    ["basses", 5],
    ["basses", 6]
  ],
  [
    ["drums", 0],
    ["sounds", 5],
    ["sounds", 6],
    ["sounds", 7],
    ["basses", 7],
    ["basses", 8]
  ],
  [
    ["drums", 1],
    ["drums", 2],
    ["sounds", 8],
    ["sounds", 9],
    ["sounds", 10],
    ["basses", 9]
  ],
  [
    ["drums", 3],
    ["drums", 4],
    ["drums", 5],
    ["sounds", 11],
    ["sounds", 12],
    ["sounds", 13]
  ],
  [
    ["drums", 6],
    ["drums", 7],
    ["drums", 8],
    ["drums", 9],
    ["sounds", 14],
    ["sounds", 15]
  ]
];

const fiveByFiveThreeGroups = [
  [
    ["sounds", 0],
    ["sounds", 1],
    ["basses", 0],
    ["basses", 1],
    ["basses", 2]
  ],
  [
    ["sounds", 2],
    ["sounds", 3],
    ["sounds", 4],
    ["basses", 3],
    ["basses", 4]
  ],
  [
    ["drums", 0],
    ["sounds", 5],
    ["sounds", 6],
    ["sounds", 7],
    ["basses", 5]
  ],
  [
    ["drums", 1],
    ["drums", 2],
    ["sounds", 8],
    ["sounds", 9],
    ["sounds", 10]
  ],
  [
    ["drums", 3],
    ["drums", 4],
    ["drums", 5],
    ["sounds", 11],
    ["sounds", 12]
  ]
];

const fiveByFiveFlower = [
  [
    ["sounds", 4],
    ["sounds", 1],
    ["sounds", 2],
    ["basses", 0],
    ["basses", 1]
  ],
  [
    ["sounds", 3],
    ["sounds", 0, "circlePad"],
    ["sounds", 5],
    ["basses", 2],
    ["basses", 3]
  ],
  [
    ["sounds", 6],
    ["sounds", 7],
    ["sounds", 8],
    ["basses", 4],
    ["sounds", 9]
  ],
  [
    ["drums", 0],
    ["drums", 1],
    ["drums", 2],
    ["sounds", 10],
    ["basses", 5]
  ],
  [
    ["drums", 3],
    ["drums", 4],
    ["sounds", 11],
    ["drums", 5],
    ["sounds", 12]
  ]
];

const padFormatMappings = {
  sixBySixThreeGroups,
  fiveByFiveThreeGroups,
  fiveByFiveFlower
};

const padFormatTileStyleMappings = {
  sixBySixThreeGroups: "tile36",
  fiveByFiveThreeGroups: "tile25",
  fiveByFiveFlower: "tile25"
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
    volume: 0
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
    this.FAQ = React.createRef();
    this.clearSelections = this.clearSelections.bind(this);
    this.activePlayers = {
      basses: [],
      drums: [],
      sounds: []
    };

    this.mobileTouchStart = 0;
    this.idle = true;
    this.activeFPIndex = 0;
    this.activeFAQSlideIndex = 0;

    this.activeAnimations = {}
  }

  initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.listAccounts();

    window.ethereum.on("accountsChanged", function(accounts) {
      location.reload();
    });

    window.ethereum.on("chainChanged", chainId => {
      location.reload();
    });

    if (accounts.length > 0) {
      const address = await provider.getSigner(0).getAddress();

      this.setState({
        isLoggedIntoMetamask: true,
        provider,
        address,
        balance: await provider.getBalance(address)
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
      address
    });
  };

  fetchNFT = async () => {
    let nftResponse;
    if (this.props.match) {
      nftResponse = await axios.get("/api/getNFT", {
        params: this.props.match.params
      });
    } else {
      nftResponse = await axios.get("/api/getFeaturedNFT");
    }

    this.setState({
      nft: nftResponse.data
    });

    // Initial pads setup
    if (!Object.keys(this.players).length) {
      const pads = {};
      const queue = {};

      Object.keys(nftResponse.data.filePaths).map(group => {
        const filePaths = nftResponse.data.filePaths[group];
        this.players[group] = [];
        pads[group] = [];
        queue[group] = [];

        filePaths.forEach(filePath => {
          this.players[group].push(
            new Tone.Player(
              `/public/${encodeURIComponent(filePath)}`
            ).toDestination()
          );

          pads[group].push(0);
        });
      });

      const padFormat = padFormatMappings[nftResponse.data.padFormatName];
      const padFormatStyleClass =
        padFormatTileStyleMappings[nftResponse.data.padFormatName];

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
            smoothing: 0.9
          });

          analyser.normalRange = true;
          player.connect(analyser);
          this.analysers[group].push(analyser);
        }
      }

      Tone.Transport.bpm.value = nftResponse.data.bpm;
      Tone.Transport.scheduleRepeat(time => {
        if (this.state.step % subSteps === 0) {
          const updatedPads = {};
          const updatedQueue = {};
          let updatedTutorialStep = this.state.tutorialStep;
          let updatedShowTutorial = this.state.showTutorial;
          let didPlayDrums = false;
          let didPlayBasses = false;
          let didPlaySounds = false;

          Object.keys(this.state.queue).forEach(group => {
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

            updatedQueue[group].forEach(soundIndex => {
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
            tutorialStep: updatedTutorialStep
          });
        }

        this.setState(state => ({
          step: (state.step + 1) % state.steps
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
                : this.state.showTutorial
          }),
          () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedPadNumbers = urlParams.get("share")
              ? urlParams.get("share").split(",")
              : [];

            if (sharedPadNumbers.length > 0) {
              this.setState({ showTutorial: false });
            }

            sharedPadNumbers.forEach(padNumber => {
              const col = parseInt(padNumber / this.state.padFormat.length);
              const row = parseInt(padNumber % this.state.padFormat.length);

              const remappedCoordinates = this.state.padFormat[col][row];
              const group = remappedCoordinates[0];
              const soundIndex = remappedCoordinates[1];
              this.togglePad(group, soundIndex);
            });

            _this.handleInitialAnimations()
            _this.setupSwayingAnimations()
          }
        );
      });


    }
  };

  didRender = async blob => {
    console.log(blob);
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
        openBidModal: true
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleClose = value => {
    this.setState({
      openBidModal: false
    });
  };

  executeScroll = () => this.myRef.current.scrollIntoView();

  executeScrollFAQ = () => this.FAQ.current.scrollIntoView();

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

    let frequency_array = new Uint8Array(analyser.map(x => x * 7000));

    const isAllZero = frequency_array.every(item => item === 0);

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
      playing: true
    }));
  }

  pause() {
    this.setState(() => ({
      playing: false,
      step: 0
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
      state => {
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
            activePad => activePad !== pad
          );
          updatedQueue[group] = updatedQueue[group].filter(
            soundIndex => soundIndex !== pad
          );
        }

        clonedPads[group][pad] = padState === 1 ? 0 : 1;

        const unstartedQueueGroup = updatedQueue[group].filter(
          soundIndex => this.players[group][soundIndex].state !== "started"
        );

        const startedQueueGroup = updatedQueue[group].filter(
          soundIndex => this.players[group][soundIndex].state === "started"
        );

        // We shaved something off, let's make it stop blinking
        if (unstartedQueueGroup.length > state.nft.activeSoundLimits[group]) {
          const toRemove = unstartedQueueGroup.slice(
            0,
            -state.nft.activeSoundLimits[group]
          );

          toRemove.forEach(soundIndex => {
            clonedPads[group][soundIndex] = 0;
          });

          updatedQueue[group] = [
            ...startedQueueGroup,
            ...unstartedQueueGroup.slice(-state.nft.activeSoundLimits[group])
          ];
        }

        return {
          pads: clonedPads,
          totalSoundsPlaying: numPads,
          queue: updatedQueue
        };
      },
      () => {
        if (!this.state.playing) this.play();
      }
    );
  }

  muiTheme = createTheme({
    overrides: {
      MuiSlider: {
        thumb: {
          color: "white"
        },
        track: {
          color: "white"
        },
        rail: {
          color: "white"
        }
      }
    }
  });

  setVolume(volume) {
    if (volume != null) {
      this.setState({
        volume: volume
      });
      this.players["basses"].forEach(index => {
        index.volume.value = volume;
      });
      this.players["drums"].forEach(index => {
        index.volume.value = volume;
      });
      this.players["sounds"].forEach(index => {
        index.volume.value = volume;
      });
    }
  }

  clearSelections() {
    this.setState({
      pads: {
        basses: [0, 0, 0, 0, 0, 0],
        drums: [0, 0, 0, 0, 0, 0],
        sounds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      playing: false,
      queue: {
        basses: [],
        drums: [],
        sounds: []
      },
      shareablePadNumbers: [],
      steps: 16,
      totalSoundsPlaying: 0
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


    touchStart = function (e) {
      this.mobileTouchStart = parseInt(e.changedTouches[0].clientX)
      window.scrollTop = 0;
    }

    touchMove = function (e) {
      let idle = this.idle

      let mobileTouchMove = parseInt(e.changedTouches[0].clientX);

      const delta = mobileTouchMove - this.mobileTouchStart;
      window.scrollTop = 0;
      if (delta == 0) {
        //user tapped, don't do anything
        return
      }

      if (idle) {
          const direction = delta > 0 ? 'next' : 'prev';
          this.handleScroll(direction);
      }
    }

    handleInitialAnimations = () => {
      let el = document.querySelector("#main-wrapper")
      //scroll handling
      el.addEventListener('wheel', e => {
        e.preventDefault()
        const direction = e.deltaY > 0 ? 'next' : 'prev';
        this.handleScroll(direction)
      });
      //mobile touch controls
      el.addEventListener('touchstart', this.touchStart.bind(this));
      el.addEventListener('touchend', this.touchMove.bind(this));


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

      anime({
        targets: ['#video-player-section .lily', '#video-player-section .quaking-grass', '#video-player-section .carnation', '#video-player-section .hyacinth', '#video-player-section .chrysanthemum'],
        easing: 'easeInOutSine',
        duration: 500,
        opacity:1,
        delay: 0,
      });

    }

    setupSwayingAnimations = () => {
      this.activeAnimations.lily = anime({
        targets: '[data-slideindex="0"] .lily path',
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

      this.activeAnimations.quakingGrass = anime({
        targets: '[data-slideindex="0"] .quaking-grass path',
        easing: 'easeInOutSine',
        duration: 1200,
        skewX: 0.8,
        skewY: -0.75,
        delay: 250,
        direction: 'alternate',
        loop: true
      });

      this.activeAnimations.firstCarnation = anime({
        targets: '[data-slideindex="0"] .carnation path',
        easing: 'easeInOutSine',
        duration: 1300,
        skewX: 0.7,
        skewY: -0.6,
        delay: 250,
        direction: 'alternate',
        loop: true
      });

      this.activeAnimations.firstHyacinth = anime({
        targets: '[data-slideindex="0"] .hyacinth path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: 0.6,
        skewY: -0.5,
        delay: 250,
        direction: 'alternate',
        loop: true
      });


      this.activeAnimations.firstChrysantheum = anime({
        targets: '[data-slideindex="0"] .chrysanthemum path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: -1,
        skewY: 1,
        delay: 250,
        direction: 'alternate',
        loop: true
      });

      //second section
      this.activeAnimations.secondSectionHyacinthes = anime({
        targets: '[data-slideindex="1"] .hyacinth path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: 0.6,
        skewY: -0.5,
        delay: 250,
        direction: 'alternate',
        loop: true,
        autoPlay: false
      });

      //third section
      this.activeAnimations.thirdSectionMonsteraLeaves = anime({
        targets: '[data-slideindex="2"] .monstera-leaf path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: -1,
        skewY: 1,
        delay: 250,
        direction: 'alternate',
        loop: true,
        autoPlay: false
      });

      this.activeAnimations.thirdSectionHyacinthes = anime({
        targets: '[data-slideindex="2"] .hyacinth path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: 0.6,
        skewY: -0.5,
        delay: 250,
        direction: 'alternate',
        loop: true,
        autoPlay: false
      });

      //fourth section
      this.activeAnimations.firstTulip = anime({
        targets: '.tulip #petals',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: -1,
        skewY: 1,
        delay: 250,
        direction: 'alternate',
        loop: true,
        autoPlay: false
      });

      this.activeAnimations.fourthSectionMonsteraLeaves = anime({
        targets: '[data-slideindex="3"] .monstera-leaf path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: -1,
        skewY: 1,
        delay: 250,
        direction: 'alternate',
        loop: true,
        autoPlay: false
      });

      this.activeAnimations.fourthSectionCarnations = anime({
        targets: '[data-slideindex="3"] .carnation path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: -1,
        skewY: 1,
        delay: 250,
        direction: 'alternate',
        loop: true,
        autoPlay: false
      });

      this.activeAnimations.fourthSectionChrysantheum = anime({
        targets: '[data-slideindex="3"] .chrysanthemum path',
        easing: 'easeInOutSine',
        duration: 1500,
        skewX: -1,
        skewY: 1,
        delay: 250,
        direction: 'alternate',
        loop: true,
        autoPlay: false
      });

    }

  handleNewFPSlideAnimation() {
    anime({
      targets: ['.activeSlide .section-intro-text'],
      easing: 'easeInOutSine',
      delay: 0,
      duration: 500,
      opacity: 1,
      translateY: [0, -10]
    });

    anime({
      targets: ['.activeSlide .packTitle'],
      easing: 'easeInOutSine',
      delay: 100,
      duration: 500,
      opacity: 1,
      translateY: [0, -10]
    });

    anime({
      targets: [`.activeSlide .details`],
      easing: 'easeInOutSine',
      delay: 200,
      duration: 500,
      opacity: 1,
      translateY: [0, -10]

    });

    if (this.activeFPIndex == 0) {
      anime({
        targets: ['#video-player-section .lily', '#video-player-section .quaking-grass', '#video-player-section .carnation', '#video-player-section .hyacinth'],
        easing: 'easeInOutSine',
        duration: 500,
        opacity:1,
        delay: 0,
      });


      this.activeAnimations.lily.play()
      this.activeAnimations.quakingGrass.play()
      this.activeAnimations.firstCarnation.play()
      this.activeAnimations.firstHyacinth.play()
      this.activeAnimations.firstChrysantheum.play()

    } else if (this.activeFPIndex == 1) {
      anime({
        targets: '#hyacinth-2',
        easing: 'easeOutQuad',
        delay: 0,
        duration: 500,
        opacity: 1,
        translateY: [0, -10],
        rotate:[45, 45]
      });

      anime({
        targets: '#hyacinth-3',
        easing: 'easeOutQuad',
        delay: 50,
        duration: 500,
        opacity: 1,
        translateY: [0, -10],
        rotate:[-30, -30]
      });

      anime({
        targets: '#main-flower',
        easing: 'easeOutQuad',
        delay: 100,
        duration: 500,
        opacity: 1,
        translateY: [0, -10]
      });

      this.activeAnimations.firstChrysantheum.play()
      this.activeAnimations.secondSectionHyacinthes.play()
    } else if (this.activeFPIndex == 2) {

        anime({
          targets: '#leaf-1',
          easing: 'easeInOutSine',
          delay: 100,
          duration: 500,
          opacity: 1,
          translateY: ["-50%", "-51%"],

          rotate:[-10, -10]
        });

        anime({
          targets: '#leaf-2',
          easing: 'easeInOutSine',
          delay: 50,
          duration: 500,
          opacity: 1,
          rotate:[-5, -5],
          translateY: [0, -10]
        });
        anime({
          targets: '#hyacinth-4',
          easing: 'easeInOutSine',
          delay: 50,
          duration: 500,
          opacity: 1,
          rotate:[200, 200],
          translateY: [0, -10]
        });

        anime({
          targets: '#carnation-3',
          easing: 'easeInOutSine',
          delay: 0,
          duration: 500,
          opacity: 1,
          rotate:[-30, -30],
          translateY: [0, -10]
        });

        this.activeAnimations.thirdSectionHyacinthes.play()
        this.activeAnimations.thirdSectionMonsteraLeaves.play()

      } else if (this.activeFPIndex == 3) {
          anime({
            targets: '#leaf-3',
            easing: 'easeInOutSine',
            delay: 0,
            duration: 500,
            opacity: 1,
            rotate:[200, 200],
            translateY: [0, -10]

          });

          anime({
            targets: '#chrysanthemum-2',
            easing: 'easeInOutSine',
            delay: 50,
            duration: 500,
            opacity: 1,
            rotate:[-30, -30],
            translateY: [0, -10]

          });

          anime({
            targets: '#carnation-2',
            easing: 'easeInOutSine',
            delay: 100,
            duration: 500,
            opacity: 1,
            rotate:[-30, -30],
            translateY: [0, -10]

          });

          anime({
            targets: '.tulip',
            easing: 'easeInOutSine',
            delay: 100,
            duration: 500,
            opacity: 1,
            translateY: [0, -10]

          });


          this.activeAnimations.fourthSectionCarnations.play()
          this.activeAnimations.fourthSectionChrysantheum.play()
          this.activeAnimations.fourthSectionMonsteraLeaves.play()

        } else if (this.activeFPIndex == 4) {
            anime({
              targets: '#hyacinth-5',
              easing: 'easeInOutSine',
              delay: 0,
              duration: 500,
              opacity: 1,
              rotate:[130, 130],
              translateY: [0, -10]
            });

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
      let hero = document.querySelector('#main-wrapper')
      let items = hero.querySelectorAll('.vslide');

      this.removeClasses(items, ['transition']);
      this.handleNewFPSlideAnimation()

      //set timeout to make sure extra scrolls doesn't fire
      setTimeout(() => {this.idle = true}, 500);
   }

   waitForFAQIdle() {
     //set timeout to make sure extra scrolls doesn't fire
     setTimeout(() => {this.idle = true}, 500);
  }

    changeSlide(direction) {

        let hero = document.querySelector('#main-wrapper')
        let main = document.querySelector('#slides-main')
        let items = hero.querySelectorAll('.vslide');
        let total = items.length;

        let activeFPIndex = this.activeFPIndex
        let previousDirection = hero.classList.contains("prev") ? "prev" : "next"
        let didChangeDirection = previousDirection !== direction

        if (activeFPIndex == total - 1 && direction == 'next') {
          console.log("at the end")
          return
        } else if (activeFPIndex == 0 && direction == 'prev') {
          console.log("at the start")
          return
        }

        this.idle = false
        hero.classList.remove('prev', 'next');
        if (direction == 'next') {
            activeFPIndex = (activeFPIndex + 1) % total
            hero.classList.add('next');
        } else {

            activeFPIndex = (activeFPIndex - 1 + total) % total
            hero.classList.add('prev');
        }

        //reset classes
        this.removeClasses(items, ['prev', 'activeSlide', 'next']);

        //set prev
        const prevItems = [...items]
            .filter(item => {
                let prevIndex;
                if (hero.classList.contains('prev')) {
                    prevIndex = activeFPIndex == total - 1 ? 0 : activeFPIndex + 1;
                } else {
                    prevIndex = activeFPIndex == 0 ? total - 1 : activeFPIndex - 1;
                }

                return item.dataset.slideindex == prevIndex;
            });

        //set next
        const nextItems = [...items]
            .filter(item => {
                let nextIndex;
                if (hero.classList.contains('next')) {
                    nextIndex = activeFPIndex == total + 1 ? 0 : activeFPIndex + 1;
                } else {
                    nextIndex = activeFPIndex == 0 ? total + 1 : activeFPIndex - 1;
                }

                return item.dataset.slideindex == nextIndex;
            });

        //set active
        const activeItems = [...items]
            .filter(item => {
                return item.dataset.slideindex == activeFPIndex;
            });

            if (didChangeDirection) {
              this.addClasses(nextItems, ['transition']);
            }

        this.addClasses(prevItems, ['prev']);

        this.addClasses(nextItems, ['next']);

        this.addClasses(activeItems, ['activeSlide']);


        const activeImageItem = main.querySelector('.activeSlide');

        this.activeFPIndex = activeFPIndex

        activeImageItem.addEventListener('transitionend', this.waitForIdle.bind(this), {
            once: true
        });
    }

    handleScroll(direction) {
      if (this.idle == true) {
        this.prepareForFPSlideChange()
        this.changeSlide(direction);
      }
    }

    prepareForFPSlideChange() {
      let hero = document.querySelector('#main-wrapper')

      if (this.activeFPIndex == 0) {
        this.activeAnimations.lily.pause()
        this.activeAnimations.quakingGrass.pause()
        this.activeAnimations.firstCarnation.pause()
        this.activeAnimations.firstHyacinth.pause()
        this.activeAnimations.firstChrysantheum.pause()
      } else if (this.activeFPIndex == 1) {
        this.activeAnimations.firstChrysantheum.pause()
        this.activeAnimations.secondSectionHyacinthes.pause()
      } else if (this.activeFPIndex == 2) {
        this.activeAnimations.thirdSectionHyacinthes.pause()
        this.activeAnimations.thirdSectionMonsteraLeaves.pause()
      } else if (this.activeFPIndex == 3) {
        this.activeAnimations.fourthSectionCarnations.pause()
        this.activeAnimations.fourthSectionChrysantheum.pause()
        this.activeAnimations.fourthSectionMonsteraLeaves.pause()
      }

      anime({
        targets: ['.activeSlide .animated-content'],
        easing: 'easeInOutSine',
        duration: 1000,
        opacity:0,
        delay: 0,
      });
    }

handleFAQSlide () {

  let wrapper = document.querySelector('#faq-wrapper')
  let main = document.querySelector('#faq-slides')
  let items = wrapper.querySelectorAll('.slide');
  let total = items.length;

  let activeFAQSlideIndex = this.activeFAQSlideIndex
  let direction = "next"
  let previousDirection = wrapper.classList.contains("prev") ? "prev" : "next"
  let didChangeDirection = previousDirection !== direction

  this.idle = false
  wrapper.classList.remove('prev', 'next');
  if (direction == 'next') {
      activeFAQSlideIndex = (activeFAQSlideIndex + 1) % total
      wrapper.classList.add('next');
  } else {

      activeFAQSlideIndex = (activeFAQSlideIndex - 1 + total) % total
      wrapper.classList.add('prev');
  }

  //reset classes
  this.removeClasses(items, ['prev', 'active', 'next']);

  //set prev
  const prevItems = [...items]
      .filter(item => {
          let prevIndex;
          if (wrapper.classList.contains('prev')) {
              prevIndex = activeFAQSlideIndex == total - 1 ? 0 : activeFAQSlideIndex + 1;
          } else {
              prevIndex = activeFAQSlideIndex == 0 ? total - 1 : activeFAQSlideIndex - 1;
          }

          return item.dataset.faqindex == prevIndex;
      });

  //set next
  const nextItems = [...items]
      .filter(item => {
          let nextIndex;
          if (wrapper.classList.contains('next')) {
              nextIndex = activeFAQSlideIndex == total + 1 ? 0 : activeFAQSlideIndex + 1;
          } else {
              nextIndex = activeFAQSlideIndex == 0 ? total + 1 : activeFAQSlideIndex - 1;
          }

          return item.dataset.faqindex == nextIndex;
      });

  //set active
  const activeItems = [...items]
      .filter(item => {
          return item.dataset.faqindex == activeFAQSlideIndex;
      });

      if (didChangeDirection) {
        this.addClasses(nextItems, ['transition']);
      }

  this.addClasses(prevItems, ['prev']);

  this.addClasses(nextItems, ['next']);

  this.addClasses(activeItems, ['active']);


  const activeImageItem = main.querySelector('.active');

  this.activeFAQSlideIndex = activeFAQSlideIndex

  activeImageItem.addEventListener('transitionend', this.waitForFAQIdle.bind(this), {
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
      shareablePadNumbers,
      showTutorial,
      tutorialStep,
      volume
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
        }
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

                <div className="section vslide activeSlide" id="video-player-section" data-slideindex="0">
                <Lily className="lily animated-content"/>
                <Carnation className="carnation animated-content"/>
                <Chrysanthemum className="chrysanthemum"/>
                <Hyacinth className="hyacinth animated-content"/>
                <QuakingGrass className="quaking-grass animated-content"/>

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
                                on: pad === 1
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
                                  on
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
                          justifyContent: "space-around",
                          position: "absolute",
                          bottom: "60px",
                          width: "100vw"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column"
                          }}
                        >
                          <div className="stopBtnContainer">
                            {this.stopButton()}
                          </div>
                          <div className="volumeContainer">
                            {this.volumeControl()}
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

                <div className="section vslide next" data-slideindex="1">

                    <Hyacinth id="hyacinth-2" className="hyacinth"/>
                    <Hyacinth id="hyacinth-3" className="hyacinth animated-content"/>

                    <div className="content-container" ref={this.myRef}>
                    <div style={{display:"flex", justifyContent: "center", alignItems:"center", gap: "84px"}}>
                    <Hyacinth id="main-flower" className="hyacinth animated-content"/>

                      <div>
                        <div>
                      <div className="section-intro-text animated-content">
                      WELCOME TO
                      </div>
                        <div className="packTitle animated-content">
                          The Secret Garden
                        </div>
                        <div className="details animated-content">
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

                <div className="section vslide"  data-slideindex="2">
                <Carnation id="carnation-3" className="carnation"/>

                <MonsteraLeaf id="leaf-2" className="monstera-leaf animated-content"/>

                <MonsteraLeaf id="leaf-1" className="monstera-leaf animated-content"/>

                <Hyacinth id="hyacinth-4" className="hyacinth animated-content"/>

                  <div className="content-container" ref={this.myRef}>

                    <div>
                      <div>
                      <div className="section-intro-text animated-content">
                      BUT...
                      </div>
                        <div className="packTitle animated-content">There's a Gap</div>
                        <div className="details animated-content">
                          Digital art is breaking all time highs on a daily
                          basis while music is still underserved.
                        </div>
                        <div className="details animated-content">
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
                <div className="section vslide" data-slideindex="3">
                <MonsteraLeaf id="leaf-3" className="monstera-leaf animated-content"/>
                <Tulip className="tulip animated-content"/>
                <Chrysanthemum id="chrysanthemum-2" className="chrysanthemum animated-content"/>
                <Carnation id="carnation-2" className="carnation"/>

                  <div className="content-container small" ref={this.myRef}>

                      <div className="section-intro-text animated-content">INTRODUCING</div>
                        <div className="packTitle animated-content">Bouquet</div>
                        <div className="details animated-content" style={{textAlign:"center"}}>
                          Bouquet is a music NFT that forms an interactive music
                          player.
                        </div>
                        <div className="details animated-content" style={{textAlign:"center"}}>
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
                <div className="section vslide" data-slideindex="4">
                <Hyacinth id="hyacinth-5" className="hyacinth animated-content"/>

                <div className="content-container">
                <div>
                <div className="section-intro-text animated-content">FAQS</div>

                <div id="faq-wrapper">
                <div id="faq-slideshow">

                <div id="faq-slides">


                  <div className="slide active" data-anchor="slide1" data-faqindex="0" ref={this.FAQ}>

                      <div className="slide-wrapper">
                        <div>
                          <div className="packTitle animated-content">
                            What do I get by buying a Bouquet?
                          </div>
                          <div className="details animated-content">
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
                  <div className="slide next" data-anchor="slide2" data-faqindex="1" ref={this.FAQ}>

                      <div className="slide-wrapper">
                      <div>
                        <div className="packTitle animated-content">
                        Bonus Features:
                        </div>
                        <div className="details animated-content">
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
                  <div className="slide" data-anchor="slide3" data-faqindex="2" ref={this.FAQ}>

                      <div className="slide-wrapper">
                        <div>
                          <div className="packTitle animated-content">
                            How do I purchase a Bouquet?
                          </div>
                          <div className="details animated-content">
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
                    onClick={() => this.handleFAQSlide()}
                  >
                    <img src={ArrowRight} className="expand" />
                  </IconButton>
                </div>

                </div>

                </div>

                <div className="section vslide" data-slideindex="5" ref={this.FAQ}>
                  <div className="container2" ref={this.myRef}>
                    <div className="albumWrapper">
                      <div>
                        {/* <div className="privacyAndTos"> */}
                        <div className="details animated-content">
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
                        <div className="details animated-content">
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
