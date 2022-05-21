import React, {useState, useEffect, useCallback, useRef} from "react";
import cx from "classnames";
import Footer from "./Footer";
import anime from "animejs/lib/anime.es.js";

export default function BouquetCarousel(props) {
  let {
    setupBouquetForIndex,
    padFormat,
    players,
    pads,
    tutorialStep,
    padFormatStyleClass,
    nfts,
    togglePad,
    rhythmPads,
    step,
    steps,
    recordingStatus,
    exportingStatus,
    isRecording,
    recording,
    shouldStopRecording,
    shouldStartRecording,
    isPlayingBack,
    repeat,
    hasNewRecording,
    padRecording,
    volume,
    playing,
    stopRecording,
    startRecording,
    clearSelections,
    canvas,
    exportRecording,
    playbackRecording,
    handlePlayback,
    setVolume,
    shareablePadNumbers,
    isLoggedIntoMetamask
  } = props

  const [idle, setIdle] = useState(true);
  const [hideBeatPad, setHideBeatPad] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [openControls, setOpenControls] = useState(false);


  var oldX = useRef(0)
  var visibleSectionIndex = useRef(0)

  const touchStart = useCallback(e => {
    oldX.current = e.pageX || parseInt(e.changedTouches[0].clientX);

    window.scrollLeft = 0;
  }, []);

  const touchMove = useCallback(e => {
    let mobileTouchEnd = e.pageX || parseInt(e.changedTouches[0].clientX);

    window.scrollLeft = 0;
    if (Math.abs(oldX.current - mobileTouchEnd) < 10) {
      //user tapped, don't do anything
      return;
    }

    if (idle) {
      const direction = mobileTouchEnd < oldX.current
        ? "nextNFT"
        : "prevNFT";

      console.log(direction)
      handleSlide(direction)
    }
  }, [oldX, idle, visibleSectionIndex]);

  useEffect(() => {
    let wrapper = document.querySelector("#collection-slide-wrapper");
    let items = wrapper.querySelectorAll(".collection-slide");
    items[0].classList.add("activeNFT")
  }, []);

  useEffect(() => {
    let el = document.querySelector("#collection-slide-wrapper");
    // let mobileEl = document

    //scroll handling
    el.addEventListener("touchstart", touchStart);
    return() => {
      el.removeEventListener("touchstart", touchStart);
    };
  }, [touchStart]);

  useEffect(() => {
    let el = document.querySelector("#collection-slide-wrapper");
    // let mobileEl = document
    el.addEventListener("touchend", touchMove);
    return() => {
      el.removeEventListener("touchend", touchMove);
    };
  }, [touchMove]);

  useEffect(() => {
    let el = document.querySelector("#collection-slide-wrapper");
    // let mobileEl = document

    //scroll handling
    el.addEventListener("mousedown", touchStart);
    return() => {
      el.removeEventListener("mousedown", touchStart);
    };
  }, [touchStart]);

  useEffect(() => {
    let el = document.querySelector("#collection-slide-wrapper");
    // let mobileEl = document
    el.addEventListener("mouseup", touchMove);
    return() => {
      el.removeEventListener("mouseup", touchMove);
    };
  }, [touchMove]);

  const addClasses = (nodeList, cssClasses) => {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].style.removeProperty('transform');
      nodeList[i].classList.add(...cssClasses);
    }
  }

  const removeClasses = (nodeList, cssClasses) => {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].classList.remove(...cssClasses);
    }
  }

  const shouldRenderPostRecording = () => {
    return (
      padRecording.length > 0 &&
      !isRecording &&
      !shouldStartRecording &&
      !shouldStopRecording
    );
  };

  const waitForIdle = () => {
    //set timeout to make sure extra scrolls doesn't fire
    let wrapper = document.querySelector("#collection-slide-wrapper");
    let items = wrapper.querySelectorAll(".collection-slide");

    removeClasses(items, ["transition"]);
    // setTimeout(() => {
    setIdle(true)
    console.log("idle")
    // }, 500);
  }

  const handleShuffle = () => {
    //shuffle function here
  }

  const handleClick = (e) => {
    e.preventDefault()
    let target = event.target
    var targetIndex
    // if (target.getAttribute("data-collectiontitleindex")) {
    targetIndex = target.getAttribute("data-collectiontitleindex")
    //
    // } else {
    //   targetIndex = target.getAttribute("data-collectionindex")
    // }

    let indexDiff = visibleSectionIndex.current - targetIndex

    if (indexDiff == 0) {
      return
    }
    if (indexDiff == 1 || indexDiff == -1) {
      let direction = indexDiff > 0
        ? "prevNFT"
        : "nextNFT"
      handleSlide(direction)
    } else {
      let direction = indexDiff > 0
        ? "nextNFT"
        : "prevNFT"
      handleSlide(direction)
    }
  }

  const handleSlide = (direction) => {
    setIdle(false);

    let wrapper = document.querySelector("#collection-slide-wrapper");
    let main = document.querySelector("#collection-slides");
    let items = wrapper.querySelectorAll(".collection-slide");
    let total = items.length;

    let previousDirection = wrapper.classList.contains("prevNFT")
      ? "prevNFT"
      : "nextNFT";
    let didChangeDirection = previousDirection !== direction;

    if (visibleSectionIndex == total - 1 && direction == "nextNFT") {
      return;
    } else if (visibleSectionIndex == 0 && direction == "prevNFT") {
      return;
    }

    var sectionIndex = visibleSectionIndex.current
    wrapper.classList.remove("prevNFT", "nextNFT");
    if (direction == "nextNFT") {
      sectionIndex = (sectionIndex + 1) % total;
      wrapper.classList.add("nextNFT");
    } else {
      sectionIndex = (sectionIndex - 1 + total) % total;
      wrapper.classList.add("prevNFT");
    }

    visibleSectionIndex.current = sectionIndex

    //reset classes
    removeClasses(items, ["prevNFT", "activeNFT", "nextNFT"]);

    //set prevNFT
    const prevItems = [...items].filter((item) => {
      let prevIndex;
      if (wrapper.classList.contains("prevNFT")) {
        prevIndex = sectionIndex == total - 1
          ? 0
          : sectionIndex + 1;
      } else {
        prevIndex = sectionIndex == 0
          ? total - 1
          : sectionIndex - 1;
      }

      return item.dataset.collectionindex == prevIndex;
    });

    //set next
    const nextItems = [...items].filter((item) => {
      let nextIndex;
      if (wrapper.classList.contains("nextNFT")) {
        nextIndex = sectionIndex == total + 1
          ? 0
          : sectionIndex + 1;
      } else {
        nextIndex = sectionIndex == 0
          ? total + 1
          : sectionIndex - 1;
      }

      return item.dataset.collectionindex == nextIndex;
    });
    //set active
    const activeItems = [...items].filter((item) => {
      return item.dataset.collectionindex == sectionIndex;
    });

    if (didChangeDirection) {
      addClasses(nextItems, ["transition"]);
    }

    addClasses(prevItems, ["prevNFT"]);

    addClasses(nextItems, ["nextNFT"]);

    addClasses(activeItems, ["activeNFT"]);

    const activeSlide = wrapper.querySelector(".activeNFT");

    activeSlide.addEventListener("transitionend", waitForIdle, {once: true});

    setupBouquetForIndex(visibleSectionIndex.current)

  }
  const mediaFileExtension = (nft) => {
     return nft.imageURL
     .split(".")
     .pop()
     .toLowerCase();
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
          players[group][soundIndex].state === "started";

        const blinkClass =
          pads[group][soundIndex] === 1 &&
          players[group][soundIndex].state !== "started"
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
              key={`pad-group-${i}`}
              className={`bloom ${cx(padClass, {
                on,
              })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
              onClick={() => {
                togglePad(group, soundIndex);
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
                togglePad(group, soundIndex);
              }}
            />
          )
        } else {
          beatPads.push(
            <div
              key={`pad-group-${j}-index-${i}`}
              id={`pad-group-${j}-index-${i}`}

              className={`${cx(padClass, {
                on,
              })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
              onClick={() => {
                togglePad(group, soundIndex);
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
      <div id="beatpad" className={`gridOuter blooming carousel`}>

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


    const toggleControls = () => {
      setOpenControls(!openControls)
    }



    const toggleTutorial = () => {
      setShowTutorial(!showTutorial)
      setOpenControls(!openControls)
    }

  const toggleBeatpad = () => {
    if (hideBeatPad) {
      anime({
        targets: ["#beatpad"],
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
        targets: ["#beatpad"],
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
    setHideBeatPad(!hideBeatPad);
  }

  return (
    <div className="container">

          <div className="gridTop">
            {rhythmPads.map((group, groupIndex) => (
              <React.Fragment>
                {group.map((pad, i) => (
                  <div
                    key={`rhythm-pad-group-${i}`}
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
      <div id="collection-slide-wrapper">
        <div id="collection-slides">
          {
            nfts.map((nft, index) => (
              <div className="collection-slide" data-collectionindex={index} key={index}>
                {mediaFileExtension(nft) === "mp4" && (
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

                    <div style={{opacity: visibleSectionIndex.current == index ? 1 : 0}}>
                    {
                      nft._id == "6226bbcb58e2c3413bea0310" &&
                      <div style={{position:"absolute", top:"0", marginTop:"32px", left:0, right:0, zIndex:"1000"}} className=" is-hidden-mobile">
                        <p className="body-small yellowish-gray-text">

                        PREVIEW
                      </p>
                          <p className="launchdate-text body-medium yellow-text">
                            LAUNCH AND REVEAL 5/24
                          </p>

                      </div>
                    }

                    <div className="bouquet-details">
                      <p className="launchdate-text body-medium yellow-text is-hidden-desktop is-hidden-tablet">
                        LAUNCH AND REVEAL 5/24
                      </p>
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
                )}
                {mediaFileExtension(nft) !== "mp4" && (
                  <img className="waterLoopVideo" src={nft.imageURL} />
                )}


                {visibleSectionIndex.current == index && (
                  <>

                  {renderPad()}


                  </>

              )}


            </div>
            ))
          }

        </div>

      </div>

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
              chords and melodies. Up to ${nfts[visibleSectionIndex].activeSoundLimits["sounds"]} can play at at time.`}
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
        <div className="song-info-container no-details">
          {/* {openControls && (
            <div className="controls-container">
              <div className="record-container control-item">
                <button
                  className={
                    shouldStartRecording ||
                    isRecording
                      ? "button record blink whitePad padWhiteVersion"
                      : "button record"
                  }
                  onClick={() => {
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording();
                    }
                  }}
                >
                  <div className="circle"></div>
                  {isRecording
                    ? shouldStopRecording
                      ? "Stopping"
                      : "Stop Recording"
                    : "Record"}
                </button>
                {isRecording && (
                  <p className="body-medium yellow-text">
                    {recordingStatus}
                    {isRecording && <Stopwatch />}
                  </p>
                )}
              </div>
              <button
                className={"button record control-item"}
                onClick={toggleBeatpad}
              >
                {hideBeatpad ? "Show Pad" : "Hide Pad"}
              </button>
              <button
                className={"button record control-item"}
                onClick={toggleTutorial}
              >
                {showTutorial
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
                      recordingStatus.length > 0 ||
                      exportingStatus.length > 0
                        ? "100%"
                        : "200px",
                  }}
                >
                  {exportingStatus.length > 0 && (
                    <div
                      style={{ marginRight: "10px" }}
                      className="body-medium yellow-text"
                    >
                      {exportingStatus}
                    </div>
                  )}
                  {shouldRenderPostRecording() ? (
                    <button
                      className={
                        exportingStatus.includes(
                          "Exporting, please wait..."
                        )
                          ? "button disabled"
                          : "button record"
                      }
                      style={{ marginRight: "10px" }}
                      disabled={exportingStatus.includes(
                        "Exporting, please wait..."
                      )}
                      onClick={() =>
                        exportRecording(recording)
                      }
                    >
                      Export
                    </button>
                  ) : (
                    <div
                      style={{ marginRight: "10px" }}
                      className="body-medium yellow-text"
                    >
                      {/* {exportingStatus ===
                      "Exporting, please wait..."
                        ? exportingStatus
                        :  */}
                      {recordingStatus}
                      {isRecording && <Stopwatch />}
                    </div>
                  )}
                  {
                    <button
                      className={
                        shouldStartRecording ||
                        isRecording
                          ? "button record blink whitePad padWhiteVersion"
                          : isPlayingBack ||
                            repeat
                          ? "button disabled"
                          : "button record"
                      }
                      onClick={() => {
                        if (isRecording) {
                          stopRecording();
                        } else {
                          startRecording();
                        }
                      }}
                      disabled={
                        isPlayingBack ||
                        repeat
                      }
                    >
                      <div className="circle" />
                      {isRecording
                        ? shouldStopRecording
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
                    justifyContent: hasNewRecording
                      ? "space-between"
                      : "flex-end",
                    alignItems: "center",
                    width: "200px",
                  }}
                >
                  {
                    <button
                      style={{
                        visibility: shouldRenderPostRecording()
                          ? "visible"
                          : "hidden",
                      }}
                      className={
                        padRecording.length <= 0 ||
                        isRecording
                          ? "button disabled"
                          : "button record"
                      }
                      onClick={handlePlayback}
                      disabled={
                        padRecording.length <= 0 ||
                        isRecording
                      }
                    >
                      {!isPlayingBack
                        ? "Playback"
                        : "Stop Playback"}
                    </button>
                  }
                </div>
              </div>
              <button
                className={"button record control-item"}
                onClick={toggleBeatpad}
              >
                {hideBeatPad ? "Show Pad" : "Hide Pad"}
              </button>
              <button
                className={"button record control-item"}
                onClick={toggleTutorial}
              >
                {showTutorial
                  ? "Hide Tutorial"
                  : "Show Tutorial"}
              </button>
            </div>
          )}



        </div>
      </div>

      <div className="volumeMeter">
        <canvas
          ref={canvas}
          style={{ minWidth: "75%", zIndex: "-10" }}
        />
      </div>
      <Footer
        white={false}
        shareURL={`https://secretgarden.fm/?share=${shareablePadNumbers.join(
          ","
        )}`}
        showShare={true}
        loggedIntoMetamaskOverride={isLoggedIntoMetamask}
        setVolume={setVolume}
        volume={volume}
        clearSelections={clearSelections}
        handleShuffle={handleShuffle}
        canvas={canvas}
        playing={playing}
        setOpenControls={toggleControls}
        openControls={openControls}
        handleSlide={handleSlide}
        nftCount={nfts.length}
        currentNFTIndex={visibleSectionIndex.current}
      />
    </div>


)}
