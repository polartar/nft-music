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
import BidModal from "./components/BidModal";
import Slider from "@material-ui/core/Slider";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import StopCircleIcon from "@mui/icons-material/StopCircle";

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
import { formatEther } from "@ethersproject/units";
import FlowerArrangement from "./components/FlowerArrangement";
import Stopwatch from "./components/Stopwatch";

import anime from "animejs/lib/anime.es.js";

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
    isRecording: false,
    shouldStartRecording: false,
    shouldStopRecording: false,
    timer: 0,
    recordingStatus: "",
    startRecordingTime: "",
    recording: null,
    isPlayingBack: false,
    signer: null
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
      const signer = await provider.getSigner(0);
      const address = await provider.getSigner(0).getAddress();

      this.setState({
        isLoggedIntoMetamask: true,
        provider,
        address,
        signer,
        balance: await provider.getBalance(address)
      });
    }
  };

  connectWallet = async () => {
    await window.ethereum.enable();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner(0);
    const address = await provider.getSigner(0).getAddress();

    this.setState({
      isLoggedIntoMetamask: true,
      provider,
      address,
      signer
    });
  };

  exportRecording = async blob => {
    try {
      const form = new FormData();

      form.append("video", blob);
      form.append("artistName", this.state.nft.artistName);
      form.append("nftName", this.state.nft.name);
      form.append("edition", this.state.nft.edition);

      const response = await axios.post("/api/exportRecording", form, {
        responseType: "blob"
      });

      const url = URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" })
      );
      const anchor = document.createElement("a");
      anchor.download = `My Mix of ${this.state.nft.name}.mp4`;
      anchor.href = url;
      anchor.click();

      this.setState({
        recordingStatus: ""
      });
    } catch (error) {
      console.log(error);
    }
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

        this.activePlayers[group] = [];

        Object.keys(nftResponse.data.filePaths).map(group => {
          const filePaths = nftResponse.data.filePaths[group];
          this.players[group] = [];
          pads[group] = [];
          queue[group] = [];

          filePaths.forEach(filePath => {
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
            smoothing: 0.9
          });

          analyser.normalRange = true;
          player.connect(analyser);
          this.analysers[group].push(analyser);
        }
      }

      Tone.Transport.bpm.value = nftResponse.data.bpm;
      Tone.Transport.scheduleRepeat(async time => {
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

        if (this.state.step === 0) {
          if (this.state.shouldStartRecording) {
            this.recorder.start();

            console.log("starting!");

            this.setState({
              shouldStartRecording: false,
              isRecording: true,
              recordingStatus: "Recording..."
            });
          }

          if (this.state.shouldStopRecording) {
            // the recorded audio is returned as a blob
            const recording = await this.recorder.stop();
            // this.exportRecording(recording); // disabled auto-export

            this.setState({
              shouldStopRecording: false,
              isRecording: false,
              recordingStatus: "Preparing export...",
              recording
            });
          }
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

            _this.handleInitialAnimations();
          }
        );
      });
    }
  };

  didRender = async blob => {
    try {
      const form = new FormData();

      form.append("video", blob[0]);

      const response = await axios.post("/api/upload", form);
    } catch (error) {
      console.log(error);
    }
  };

  handleInitialAnimations = () => {
    anime({
      targets: [
        ".video-container",
        ".beatPackTitle",
        ".artistName",
        ".gridOuter"
      ],
      easing: "easeInOutSine",
      duration: 750,
      opacity: 1,
      delay: 1000
    });

    anime({
      targets: [".play-controls", ".learnMore"],
      easing: "easeInOutSine",
      duration: 750,
      opacity: 1,
      delay: 2000
    });

    if (!this.state.showTutorial) {
      anime({
        targets: [".record-container"],
        easing: "easeInOutSine",
        duration: 750,
        opacity: 1,
        delay: 2000
      });
    }

    anime({
      targets: [
        "#video-player-section .lily",
        "#video-player-section .quaking-grass",
        "#video-player-section .carnation",
        "#video-player-section .hyacinth",
        "#video-player-section .chrysanthemum"
      ],
      easing: "easeInOutSine",
      duration: 500,
      opacity: 1,
      delay: 0
    });

    anime({
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
      loop: true
    });

    anime({
      targets: '[data-slideindex="0"] .quaking-grass path',
      easing: "easeInOutSine",
      duration: 1200,
      skewX: 0.8,
      skewY: -0.75,
      delay: 250,
      direction: "alternate",
      loop: true
    });

    anime({
      targets: '[data-slideindex="0"] .carnation path',
      easing: "easeInOutSine",
      duration: 1300,
      skewX: 0.7,
      skewY: -0.6,
      delay: 250,
      direction: "alternate",
      loop: true
    });

    anime({
      targets: '[data-slideindex="0"] .hyacinth path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: 0.6,
      skewY: -0.5,
      delay: 250,
      direction: "alternate",
      loop: true
    });

    anime({
      targets: '[data-slideindex="0"] .chrysanthemum path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true
    });
  };

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "/public/artists/oksami/garden/visualizer/js/patch.js";
    script.async = true;

    document.body.appendChild(script);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.showTutorial !== this.state.showTutorial) {
      //tutorial is over we can show the record button

      anime({
        targets: [".record-container"],
        easing: "easeInOutSine",
        duration: 750,
        opacity: 1,
        delay: 0
      });
    }
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

    // preserved for millisecond work
    // const milliseconds = cloneDeep(this.state.timer);

    if (this.state.padRecording.length <= 0) {
      this.setState({
        startRecordingTime: Date.now()
      });
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
                        : 0
                    ]
                  ]
                });
              }
            });
          });
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

  // recording work
  startRecording() {
    this.setState({
      shouldStartRecording: true,
      recordingStatus: "Waiting for next loop to start...",
      padRecording: []
    });
    let milliseconds = 0;

    const incrementMilliseconds = () => {
      this.setState({
        timer: (milliseconds += 1000)
      });
    };

    window.timer = setInterval(incrementMilliseconds, 10);
    // window.timer = window.setInterval(incrementMilliseconds, 10);
    // intervals.push(setInterval(incrementMilliseconds, 10));
  }

  async stopRecording() {
    console.log("stopped recording...");

    // clear interval
    window.clearInterval(window.timer);

    this.setState({
      shouldStopRecording: true,
      recordingStatus: "Preparing export...",
      timer: 0
    });
  }
  w1;

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

      Object.keys(this.players).forEach(group => {
        this.players[group].forEach((_, soundIndex) => {
          this.players[group][soundIndex].volume.value = volume;
        });
      });
    }
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

    Object.keys(this.players).forEach(group => {
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
      shouldStopRecording: false
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

  playbackRecording(padRecording, callback) {
    this.setState({
      isPlayingBack: true
    });

    // reset step so that playback isn't dependent on waiting for "next loop"
    this.setState({
      step: 0
    });

    for (let i = 0; i <= padRecording.length - 1; i++) {
      console.log("padRecording ms: ", padRecording[i][2]);
      setTimeout(() => {
        // each loop, call passed in callback function
        callback(padRecording[i]);
        // stagger the pad's timeout by their milliseconds
        // }, i * pad[2]);
        // }, padRecording[i][2] + (padRecording[i - 1] ? padRecording[i - 1][2] : padRecording[0][2]));
      }, padRecording[i][2]);
    }
  }

  saveMix = async (tokenId, padRecording, address) => {
    const signature = await this.state.signer.signMessage(address);

    const response = await axios.post("/api/saveMix", {
      address,
      signature,
      tokenId,
      padRecording
    });

    console.log("response from api fetch: ", response);
  };

  shouldRenderPostRecording = () => {
    return (
      this.state.padRecording.length > 0 &&
      !this.state.isRecording &&
      !this.state.shouldStopRecording
    );
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
      shareablePadNumbers,
      showTutorial,
      tutorialStep,
      padRecording,
      timer
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
        <React.StrictMode>
          <BidModal
            nft={nft}
            open={this.state.openBidModal}
            onClose={this.handleClose}
            didCompleteBid={this.fetchNFT}
            currentBidAmount={currentBidAmount}
          />
          {/* <canvas
            ref={this.cablesCanvas}
            id="glcanvas"
            width="500"
            height="500"
          ></canvas> */}
          <div id="main-wrapper">
            <div id="slideshow">
              <div id="slides-main">
                <div
                  className="section vslide activeSlide"
                  id="video-player-section"
                  data-slideindex="0"
                >
                  <FlowerArrangement />
                  <div className="container scrollbar">
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

                    <div className={`gridOuter ${padFormatStyleClass}`}>
                      {padFormat.map((column, j) => {
                        return column.map((remappedCoordinates, i) => {
                          const group = remappedCoordinates[0];
                          const soundIndex = remappedCoordinates[1];
                          const additionalClasses = remappedCoordinates[2]
                            ? remappedCoordinates[2]
                            : "";

                          const on =
                            this.players[group][soundIndex].state === "started";

                          const blinkClass =
                            pads[group][soundIndex] === 1 &&
                            this.players[group][soundIndex].state !== "started"
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
                    <div className="song-info-wrapper">
                      {showTutorial && (
                        <React.Fragment>
                          {tutorialStep === 0 && (
                            <React.Fragment>
                              <div className="currentBid tile25 tutorialStep">
                                Welcome to the Secret Garden.
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

                      <div className="song-info-container">
                        {!showTutorial && (
                          <div className="record-container">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}
                            >
                              {this.shouldRenderPostRecording() ? (
                                <button
                                  className="button record"
                                  style={{ marginRight: "10px" }}
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
                                  {this.state.recordingStatus}
                                  {this.state.isRecording && <Stopwatch />}
                                </div>
                              )}
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
                                <div className="circle" />
                                {this.state.isRecording
                                  ? this.state.shouldStopRecording
                                    ? "Stopping"
                                    : "Stop Recording"
                                  : "Record"}
                              </button>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%"
                              }}
                            >
                              {this.shouldRenderPostRecording() && (
                                <button
                                  style={{
                                    marginRight: "10px"
                                  }}
                                  className="button record"
                                  onClick={() =>
                                    this.saveMix(
                                      this.state.nft.tokenId,
                                      this.state.padRecording,
                                      this.state.address
                                    )
                                  }
                                >
                                  Save Mix
                                </button>
                              )}
                              <button
                                style={{
                                  visibility: this.shouldRenderPostRecording()
                                    ? "visible"
                                    : "hidden"
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
                                      pad => {
                                        this.togglePad(pad[0], pad[1]);
                                      }
                                    );
                                  } else {
                                    this.setState({
                                      isPlayingBack: false
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
                            </div>
                          </div>
                        )}
                        <div className="song-details">
                          <div className="beatPackTitle">{nft.name}</div>
                          <div
                            className="artistName"
                            onClick={() => {
                              console.log(
                                "this.state.padRecording: ",
                                this.state.padRecording
                              );
                              console.log("window.timer: ", window.timer);
                            }}
                          >{`by ${nft.artistName} ${
                            nft.visualArtistName
                              ? `& ${nft.visualArtistName}`
                              : ""
                          }`}</div>
                        </div>
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
          </div>

          <div className="container2 scrollBar">
            <div className="albumWrapper">
              <div className="albumPicWrapper">
                {mediaFileExtension === "mp4" && (
                  <video
                    width="140"
                    height="140"
                    playsinline="true"
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
                <div className="editionInfo">{`Editions Left: ${nft.edition}`}</div>
                <div className="bidInfoWrapper">
                  <div className="bidItem">
                    <div className="bidTitle">
                      {nft.ownerAddress ? "Sale Price" : "Current Bid"}
                    </div>
                    <div className="bidInfo">{`${currentBidAmount} ETH`}</div>
                  </div>
                  <div className="bidItem right">
                    <div className="bidTitle">TIME UNTIL NEXT PRICE DROP</div>
                    <Countdown
                      date={nft.bidEndDate}
                      renderer={({
                        days,
                        hours,
                        minutes,
                        seconds,
                        completed
                      }) => {
                        if (completed) {
                          // Render a completed state
                          return (
                            <div className="bidInfo">No more price drops</div>
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
                {!nft.ownerAddress && (
                  <Button
                    className="offerButton"
                    onClick={this.handleClickOpen}
                    disabled={provider && provider._network.chainId !== 1}
                  >
                    {provider && provider._network.chainId === 1
                      ? "Mint"
                      : "Please use Mainnet"}
                  </Button>
                )}
                <div className="nftDetails">
                  Owners receive an interactive NFT of the stem player, ability
                  to set their own mixes on the NFT, lossless sound files, and a
                  non-exclusive license for distribution.
                </div>
                <div className=" bidOnDesktop">
                  Sign in on Desktop to place bid
                </div>
                {/* <div className="historyWrapper">
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

                      const bidCurrency = bid.payment_token_contract.symbol;

                      return (
                        <tr>
                          <td>{`${formattedBidAmount} ${bidCurrency}`}</td>
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
                </div> */}
              </div>
            </div>
            <div className="privacyAndTos">
              <a
                href={`https://opensea.io/assets/${nft.tokenAddress}/${nft.tokenId}`}
                target="_blank"
              >
                View on OpenSea
              </a>
              <a href="/tos" target="_blank">
                Terms of Service
              </a>
              <a href="/privacy" target="_blank">
                Privacy Policy
              </a>
            </div>
            <div className="ourSocials">
              <span>inquiries@secretgarden.fm</span>
              <a href="https://twitter.com/SecretGarden_FM" target="_blank">
                <img src={Twitter} className="ourTwitter" />
              </a>

              <a href="https://discord.gg/ykrzXB9ZsV" target="_blank">
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
            canvas={this.canvas}
          />
        </React.StrictMode>
      );
    } else {
      return <Loading />;
    }
  }
}

export default Sequencer;
