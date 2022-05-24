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
import OpaqueLoadingScreen from "./components/OpaqueLoading";
import LoadingFlower from "./components/LoadingFlower";
import "./css/bidModal.css";

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

const sundayjournalwavlink = 'https://drive.google.com/drive/folders/19ngBYg5r6wLM7EFnEcVTfNuOWxO8mWx3?usp=sharing'
const miaminightswavlink = 'https://drive.google.com/drive/folders/16F93IcyyazI6tDP-MHqhZX_0t3rEbC8q?usp=sharing'
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
    signer: null,
    repeat: false,
    endOfPlayback: false,
    isLoading: false,
    openControls: false,
    hideBeatpad: false,
    isOwner: false,
    didFetchOwnerNFTs: false,
    hasNewRecording: false,
    exportingStatus: "",
    startRecordingTime: "",
    endTotalRecordingTime: "",    
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

    window.ethereum.on("chainChanged", (chainId) => {
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
        balance: await provider.getBalance(address),
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
      signer,
    });
  };

  exportRecording = async (blob) => {
    this.setState({
      exportingStatus: `Exporting, please wait...`,
    });
    this.calculateProgressPercentage();

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
        // recordingStatus: "",
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
        padFormat.push(nftResponse.data.blooms[0]["stems"])
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
            // this.exportRecording(recording); // disabled auto-export

            this.setState({
              shouldStopRecording: false,
              isRecording: false,
              recordingStatus: "Preparing export...",
              recording,
              hasNewRecording: true,
              endTotalRecordingTime: Date.now(),
            });
          }
        }

        if (!this.state.repeat && this.state.endOfPlayback) {
          this.setState({
            isPlayingBack: false,
          });
        }

        if (this.state.step === 0) {
          if (this.state.repeat && this.state.endOfPlayback) {
            this.setState({
              endOfPlayback: false,
            });
            this.playbackRecording(this.state.padRecording, (pad) =>
              this.togglePad(pad[0], pad[1])
            );
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

  handleInitialAnimations = () => {
    anime({
      targets: [
        ".video-container",
        ".beatPackTitle",
        ".artistName",
        ".gridOuter",
      ],
      easing: "easeInOutSine",
      duration: 750,
      opacity: 1,
      delay: 1000,
    });

    anime({
      targets: [".play-controls", ".learnMore"],
      easing: "easeInOutSine",
      duration: 750,
      opacity: 1,
      delay: 2000,
    });

    if (!this.state.showTutorial) {
      anime({
        targets: [".record-container"],
        easing: "easeInOutSine",
        duration: 750,
        opacity: 1,
        delay: 2000,
      });
    }

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
      loop: true,
    });

    anime({
      targets: '[data-slideindex="0"] .quaking-grass path',
      easing: "easeInOutSine",
      duration: 1200,
      skewX: 0.8,
      skewY: -0.75,
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    anime({
      targets: '[data-slideindex="0"] .carnation path',
      easing: "easeInOutSine",
      duration: 1300,
      skewX: 0.7,
      skewY: -0.6,
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    anime({
      targets: '[data-slideindex="0"] .hyacinth path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: 0.6,
      skewY: -0.5,
      delay: 250,
      direction: "alternate",
      loop: true,
    });

    anime({
      targets: '[data-slideindex="0"] .chrysanthemum path',
      easing: "easeInOutSine",
      duration: 1500,
      skewX: -1,
      skewY: 1,
      delay: 250,
      direction: "alternate",
      loop: true,
    });
  };

  async componentDidMount() {
    const script = document.createElement("script");

    script.src = "/public/artists/oksami/garden/visualizer/js/patch.js";
    script.async = true;

    document.body.appendChild(script);

    if (this.state.address) {
      await axios
        .get("/api/getNFTsForOwner", {
          params: {
            collection: this.state.nft.tokenAddress,
            owner: this.state.address,
            chain: "eth",
          },
        })
        .then((response) => {
          console.log("response: ", response);
          if (
            response.data.some(
              (nft) => nft.tokenId === this.props.match.params.edition
            )
          ) {
            this.setState({
              isOwner: true,
            });
          }
        });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.openControls !== this.state.openControls) {
      anime({
        targets: [".record-container"],
        easing: "easeInOutSine",
        duration: 750,
        opacity: 1,
        delay: 0,
      });
    }

    if (prevState.nft !== this.state.nft && this.state.nft) {
      console.log("this.state.nft: ", this.state.nft);
      this.getMix(
        // this.state.address,
        this.state.nft.tokenAddress,
        this.props.match.params.edition
      );
    }

    // autoplay that works on local
    // if (
    //   prevState.padRecording.length <= 0 &&
    //   this.state.padRecording.length > 0 &&
    //   !this.state.isRecording &&
    //   !this.state.shouldStartRecording
    // ) {
    //   this.playbackRecording(this.state.padRecording, pad =>
    //     this.togglePad(pad[0], pad[1])
    //   );
    // }

    if (!this.state.didFetchOwnerNFTs && this.state.address && this.state.nft) {
      await axios
        .get("/api/getNFTsForOwner", {
          params: {
            collection: this.state.nft.tokenAddress,
            owner: this.state.address,
            chain: "eth",
          },
        })
        .then((response) => {
          console.log("response: ", response);
          if (
            response.data.some(
              (nft) => nft.tokenId === this.props.match.params.edition
            )
          ) {
            this.setState({
              isOwner: true,
              didFetchOwnerNFTs: true,
            });
          }
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
    // const milliseconds = cloneDeep(this.state.timer);

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
    this.setState({
      shouldStartRecording: true,
      recordingStatus: "Waiting for next loop to start...",
      padRecording: [],
    });
    let milliseconds = 0;

    const incrementMilliseconds = () => {
      this.setState({
        timer: (milliseconds += 1000),
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

    // this.setState({
    //   isPlayingBack: true,
    // });

    // if (!this.state.repeat) {
    //   // reset step so that playback isn't dependent on waiting for "next loop"
    //   this.setState({
    //     step: 0,
    //   });
    // }

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

  saveMix = async (address, tokenAddress, tokenId, padRecording) => {
    const signature = await this.state.signer.signMessage(address);
    // this.setState({
    //   isLoading: true,
    // });
    await axios
      .post("/api/saveMix", {
        address,
        signature,
        tokenAddress,
        tokenId,
        padRecording,
      })
      .then((response) => {
        if (response) {
          this.setState({
            isLoading: false,
          });
        }
      });
  };

  getMix = async (tokenAddress, tokenId) => {
    this.setState({
      isLoading: true,
    });
    // const signature = await this.state.signer.signMessage(address);

    console.log(tokenId);
    await axios
      .get("/api/getMix", {
        params: {
          tokenAddress,
          tokenId,
        },
      })
      .then((response) => {
        if (response.data.padRecording) {
          setTimeout(() => {
            this.setState({
              padRecording: response.data.padRecording,
              repeat: true,
              isLoading: false,
            });
            return response.data.padRecording;
          }, 7000);
        } else {
          console.log("User has no previously saved mix.");
          this.setState({
            isLoading: false,
          });
        }
      });
  };

  shouldRenderPostRecording = () => {
    return (
      this.state.padRecording.length > 0 &&
      !this.state.isRecording &&
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

  playMix = (padRecording) => {
    if (this.state.padRecording.length > 0) {
      this.setState({
        repeat: true,
      });

      this.playbackRecording(this.state.padRecording, (pad) =>
        this.togglePad(pad[0], pad[1])
      );
    }
  };

  setOpenControls() {
    this.setState({ openControls: !this.state.openControls });
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
      shareablePadNumbers,
      showTutorial,
      tutorialStep,
      padRecording,
      timer,
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
      const beatPads = []
      const blooms = []
      const bloomObject = {"top":[], "right":[], "bottom": [], "left": []}

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

          if (padFormatStyleClass == "tile36" && j >= 6) {
            blooms.push(
              <div
                key={`pad-group-${j}-index-${i}`}
                className={`bloom ${cx(padClass, {
                  on,
                })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
                onClick={() => {
                  this.togglePad(group, soundIndex);
                }}
              />
            )
          } else if (padFormatStyleClass == "tile25" && j >= 5) {
            blooms.push(
              <div
                key={`pad-group-${j}-index-${i}`}
                className={`bloom ${cx(padClass, {
                  on,
                })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
                onClick={() => {
                  this.togglePad(group, soundIndex);
                }}
              />
            )
          } else {
            beatPads.push(
              <div
                key={`pad-group-${j}-index-${i}`}
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
      })}

      var bloomOrder = 0
      {blooms.map((bloom) => {
        if (bloomOrder <= 2) {
          bloomObject["top"].push(bloom)
        } else if (bloomOrder > 2 && bloomOrder <= 5) {
          bloomObject["bottom"].push(bloom)
        } else if (bloomOrder > 5 && bloomOrder <= 8) {
          bloomObject["right"].push(bloom)
        } else {
          bloomObject["left"].push(bloom)
        }
        if (bloomOrder < 11) {
          bloomOrder = bloomOrder + 1
        } else {
          bloomOrder = 0
        }
      })}

      return (
        <>
        <div className={`gridOuter blooming`}>

        <div className="bloom-group top">
          {bloomObject["top"]}
        </div>
        <div className="bloom-group right">
          <div className="bloom-content">

          {bloomObject["right"]}
        </div>
        </div>
        <div className="bloom-group left">
          <div className="bloom-content">
          {bloomObject["left"]}
        </div>
        </div>
        <div className="bloom-group bottom">
          {bloomObject["bottom"]}
        </div>
        <div className={`main-pad-group ${padFormatStyleClass}`}>

          {beatPads}
        </div>

        </div>
        </>
      )
    }

    // Set up active sounds limit
    if (nft && loaded) {
      const mediaFileExtension = nft.imageURL
        .split(".")
        .pop()
        .toLowerCase();

      return (
        <React.StrictMode>
          {this.state.isLoading && (
            <div style={{ backgroundColor: "black", height: "100vh" }}>
              <div className="modalBody2" style={{ paddingBottom: "80px" }}>
                <div style={{ textAlign: "center" }}>
                  <div>
                    <p
                      className="body-medium white-text"
                      style={{ margin: "16px auto", maxWidth: "360px" }}
                    >
                      Loading assets, please wait...
                    </p>
                    <div id="loading-spinner" style={{ marginTop: "44px" }}>
                      {" "}
                      <LoadingFlower id="loading-flower" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <BidModal
            nft={nft}
            open={this.state.openBidModal}
            onClose={this.handleClose}
            didCompleteBid={this.fetchNFT}
            currentBidAmount={currentBidAmount}
          />
          {!this.state.isLoading && (
            <div className="fullscreen-overlay" id="mix-overlay">
              {/* <button className="metamask-button" onClick={this.handlePlayMix}> */}
              <button
                className="metamask-button"
                onClick={() => {
                  const element = document.getElementById("mix-overlay");
                  element.remove();
                  //handle play mix
                  if (this.state.padRecording.length > 0) {
                    this.setState({
                      repeat: true,
                    });

                    this.playbackRecording(this.state.padRecording, (pad) =>
                      this.togglePad(pad[0], pad[1])
                    );
                  }
                }}
              >
                Play Mix
              </button>
            </div>
          )}
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

                    {renderPad()}

                    <div className="song-info-wrapper">
                      {showTutorial && (
                        <div className="tutorial-wrapper">
                          <React.Fragment>
                            {tutorialStep === 0 && (
                              <React.Fragment>
                                <div className="body-medium white-text font-bold">
                                  Welcome to the Secret Garden.
                                </div>
                                <br />
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
                                Try out different combinations and share them
                                with friends below. <br />
                                <br />
                                If you'd like to learn more about Secret Garden,
                                scroll down.
                              </div>
                            )}
                          </React.Fragment>
                        </div>
                      )}

                      <div className="song-info-container">
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
                                {/* {this.state.exportingStatus ===
                                "Exporting, please wait..." ? (
                                  <div
                                    style={{ marginRight: "10px" }}
                                    className="body-medium yellow-text"
                                  >
                                    {this.state.exportingStatus}
                                  </div>
                                ) : this.state.isOwner &&
                                  this.shouldRenderPostRecording() ? (
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
                                    {this.state.exportingStatus ===
                                    "Exporting, please wait..."
                                      ? this.state.exportingStatus
                                      : this.state.recordingStatus}
                                    {this.state.isRecording && <Stopwatch />}
                                  </div>
                                )} */}
                                {this.state.exportingStatus.length > 0 && (
                                <div
                                  style={{ marginRight: "10px" }}
                                  className="body-medium yellow-text"
                                >
                                  {this.state.exportingStatus}
                                </div>
                              )}
                                {this.shouldRenderPostRecording() && this.state.isOwner ? (
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
                                  {this.state.recordingStatus}
                                  {this.state.isRecording && <Stopwatch />}
                                </div>
                              )}
                                {this.state.isOwner && (
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
                                )}
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
                                {this.state.isOwner &&
                                  this.shouldRenderPostRecording() &&
                                  this.state.hasNewRecording && (
                                    <button
                                      style={{
                                        marginRight: "10px",
                                      }}
                                      className="button record"
                                      onClick={() =>
                                        this.saveMix(
                                          this.state.address,
                                          this.state.nft.tokenAddress,
                                          this.props.match.params.edition,
                                          this.state.padRecording
                                        )
                                      }
                                    >
                                      Save Mix
                                    </button>
                                  )}
                                {this.state.isOwner && (
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
                                  
                                )}
                              </div>
                              {this.state.isOwner && (
                                <a href={nft.name === 'Sunday Journal' ? sundayjournalwavlink : miaminightswavlink} target="_blank" rel="noreferrer noopener">
                                  <button className={"button record"}>
                                    Download Stems
                                  </button>
                                </a>
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
                        )}
                        <div className="song-details">
                          <div className="beatPackTitle">{nft.name}</div>
                          <div className="artistName">{`by ${nft.artistName} ${
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
                        completed,
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
            playing={this.state.playing}
            setOpenControls={this.setOpenControls.bind(this)}
            openControls={openControls}
            playMix={this.playMix}
          />
        </React.StrictMode>
      );
    } else {
      return <Loading />;
    }
  }
}

export default Sequencer;
