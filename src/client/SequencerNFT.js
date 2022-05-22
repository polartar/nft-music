/* eslint-disable react/no-unused-state, react/no-array-index-key */
import axios from "axios";
import cx from "classnames";
import React, { Component, createRef } from "react";
import * as Tone from "tone";
import Loading from "./components/Loading";
import Slider from "@material-ui/core/Slider";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Footer from "./components/Footer";
import anime from "animejs/lib/anime.es.js";

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

const current = new Date();
const nextYear = new Date();

nextYear.setFullYear(current.getFullYear() + 1);

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
    // showTutorial: false,
    // tutorialStep: 0,
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
  };

  constructor(props) {
    super(props);

    this.players = {};
    this.rhythmPads = [];

    this.fetchNFT();

    this.cablesCanvas = createRef();
    this.canvas = createRef();

    this.myRef = React.createRef();
    this.clearSelections = this.clearSelections.bind(this);
    this.activePlayers = {
      basses: [],
      drums: [],
      sounds: [],
    };
  }

  fetchNFT = async () => {
    let nftResponse;
    if (this.props.match) {
      nftResponse = await axios.get("/api/getNFT", {
        params: this.props.match.params,
        xsrfCookieName: null,
        withCredentials: false,
      });
    } else {
      nftResponse = await axios.get("/api/getFeaturedNFT", {
        xsrfCookieName: null,
        withCredentials: false,
      });
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

        filePaths.forEach((filePath) => {
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
      Tone.Transport.scheduleRepeat((time) => {
        if (this.state.step % subSteps === 0) {
          const updatedPads = {};
          const updatedQueue = {};
          // let updatedTutorialStep = this.state.tutorialStep;
          // let updatedShowTutorial = this.state.showTutorial;
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

          // if (this.state.showTutorial) {
          //   if (this.state.tutorialStep === 3) {
          //     updatedShowTutorial = false;
          //   }

          //   if (
          //     (this.state.tutorialStep === 0 && didPlayDrums) ||
          //     (this.state.tutorialStep === 1 && didPlayBasses) ||
          //     (this.state.tutorialStep === 2 && didPlaySounds)
          //   ) {
          //     updatedTutorialStep += 1;
          //   }
          // }

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
            // showTutorial: updatedShowTutorial,
            // tutorialStep: updatedTutorialStep
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

        this.setState(
          () => ({
            loaded: true,
            // showTutorial:
            //   this.state.showTutorial && sharedPadNumbers !== null
            //     ? false
            //     : this.state.showTutorial
          }),
          () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sharedPadNumbers = urlParams.get("share")
              ? urlParams.get("share").split(",")
              : [];

            // if (sharedPadNumbers.length > 0) {
            //   this.setState({ showTutorial: false });
            // }

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

  didRender = async (blob) => {
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.nft !== this.state.nft && this.state.nft) {
      this.getMix(this.state.nft.tokenAddress, this.props.match.params.tokenId);
    }

    // autoplay
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
    // if (this.state.totalSoundsPlaying > 0 && !this.state.showTutorial) {
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
    // if (this.state.showTutorial) {
    //   if (group === "basses" && this.state.tutorialStep < 1) {
    //     return;
    //   } else if (group === "sounds" && this.state.tutorialStep < 2) {
    //     return;
    //   }
    // }

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
      this.players["basses"].forEach((index) => {
        index.volume.value = volume;
      });
      this.players["drums"].forEach((index) => {
        index.volume.value = volume;
      });
      this.players["sounds"].forEach((index) => {
        index.volume.value = volume;
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

    for (let i = 0; i <= padRecording.length - 1; i++) {
      setTimeout(() => {
        // each loop, call passed in callback function
        callback(padRecording[i]);
        // stagger the pad's timeout by their milliseconds
        // }, i * pad[2]);
        // }, padRecording[i][2] + (padRecording[i - 1] ? padRecording[i - 1][2] : padRecording[0][2]));
        if (i === padRecording.length - 1) {
          this.setState({
            endOfPlayback: true,
          });
        }
      }, padRecording[i][2]);
    }
  }

  getMix = async (tokenAddress, tokenId) => {
    this.setState({
      isLoading: true,
    });
    // const signature = await this.state.signer.signMessage(address);
    await axios
      .get("/api/getMix", {
        params: {
          tokenAddress,
          tokenId,
        },
        xsrfCookieName: null,
        withCredentials: false,
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
          }, 1000);
        } else {
          console.log("User has no previously saved mix.");
          this.setState({
            isLoading: false,
          });
        }
      });
  };

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

  // setShowTutorial() {
  //   this.setState({ showTutorial: !this.state.showTutorial });
  // }

  handlePlayMix() {
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
      // showTutorial,
      // tutorialStep,
      openControls,
    } = this.state;


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
                )
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
                )
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
            <div className={`gridOuter blooming embed`}>

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
        .toLowerCase(); // Get the file extension

      return (
        <React.StrictMode>
          <div id="main-wrapper">
            <div id="slideshow">
              <div id="slides-main">
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
                {/* <canvas
            ref={this.cablesCanvas}
            id="glcanvas"
            width="500"
            height="500"
          ></canvas> */}
                <div className="container scrollbar">
                  {mediaFileExtension === "mp4" && (
                    <div className="video-container opensea">
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

                  {/* <div className="beatPackTitle">{nft.name}</div>
              <div className="artistName">{`by ${nft.artistName} ${
                nft.visualArtistName ? `& ${nft.visualArtistName}` : ""
              }`}</div> */}

              {renderPad()}
            {openControls && (
              <div
                className="song-info-wrapper"
              >
                <div className="song-info-container">
                  <div className="controls-container">
                    <button
                      className={"button record control-item"}
                      onClick={this.setHideBeatpad.bind(this)}
                    >
                      {this.state.hideBeatpad ? "Show Pad" : "Hide Pad"}
                    </button>
                    {/* <button
                      className={"button record control-item"}
                      onClick={this.setShowTutorial.bind(this)}
                    >
                      {this.state.showTutorial
                        ? "Hide Tutorial"
                        : "Show Tutorial"}
                    </button> */}
                        </div>
                        <div className="song-details"></div>
                      </div>
                    </div>
                  )}
                </div>
                <Footer
                  white={false}
                  showShare={false}
                  loggedIntoMetamaskOverride={false}
                  muiTheme={this.muiTheme}
                  setVolume={this.setVolume.bind(this)}
                  volume={this.state.volume}
                  clearSelections={this.clearSelections}
                  canvas={this.canvas}
                  playing={this.state.playing}
                  playMix={this.playMix}
                  setOpenControls={this.setOpenControls.bind(this)}
                  openControls={openControls}
                />
              </div>
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
