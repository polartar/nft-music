import React, {useState, useEffect, useCallback, useRef} from "react";
import cx from "classnames";

export default function BouquetCarousel(props) {
  const [idle, setIdle] = useState(true);


  var oldX = useRef(0)
  var visibleSectionIndex = useRef(0)

  const touchStart = useCallback(e => {
    oldX.current = e.pageX || parseInt(e.changedTouches[0].clientX);

    window.scrollLeft = 0;
  }, []);

  const touchMove = useCallback(e => {
    let mobileTouchEnd = e.pageX || parseInt(e.changedTouches[0].clientX);

    window.scrollLeft = 0;
    if (oldX.current == mobileTouchEnd) {
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

    props.setupBouquetForIndex(visibleSectionIndex.current)

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

    {props.padFormat.map((column, j) => {
      return column.map((remappedCoordinates, i) => {
        const group = remappedCoordinates[0];
        const soundIndex = remappedCoordinates[1];
        const additionalClasses = remappedCoordinates[2]
          ? remappedCoordinates[2]
          : "";

        const on =
          props.players[group][soundIndex].state === "started";

        const blinkClass =
          props.pads[group][soundIndex] === 1 &&
          props.players[group][soundIndex].state !== "started"
            ? "blink"
            : "";
        const whiteClass = group === "sounds" ? "whitePad" : "";
        let tutorialClass = "";
        const padClass =
          group == "sounds" ? "padWhiteVersion" : "pad";

        if (props.showTutorial) {
          if (props.tutorialStep === 0 && group !== "drums") {
            tutorialClass = "tutorialPad";
          } else if (tutorialStep === 1 && group !== "basses") {
            tutorialClass = "tutorialPad";
          } else if (tutorialStep === 2 && group !== "sounds") {
            tutorialClass = "tutorialPad";
          }
        }

        if (props.padFormatStyleClass == "tile36" && j >= 6) {
          blooms.push(
            <div
              key={`pad-group-${i}`}
              className={`bloom ${cx(padClass, {
                on,
              })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
              onClick={() => {
                props.togglePad(group, soundIndex);
              }}
            />
          )
        } else if (props.padFormatStyleClass == "tile25" && j >= 5) {
          blooms.push(
            <div
              key={`pad-group-${i}`}
              className={`bloom ${cx(padClass, {
                on,
              })} ${blinkClass} ${whiteClass} ${tutorialClass} ${additionalClasses}`}
              onClick={() => {
                props.togglePad(group, soundIndex);
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
                props.togglePad(group, soundIndex);
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
      <div className={`gridOuter blooming carousel`}>

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
      <div className={`main-pad-group ${props.padFormatStyleClass}`}>

        {beatPads}
      </div>

      </div>
      </>
    )
  }

  return (
    <div id="collection-slide-wrapper">
      <div id="collection-slides">
        {
          props.nfts.map((nft, index) => (
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
                </div>
              )}
              {mediaFileExtension(nft) !== "mp4" && (
                <img className="waterLoopVideo" src={nft.imageURL} />
              )}


              {visibleSectionIndex.current == index && (
                <>
                <div className="gridTop">
                  {props.rhythmPads.map((group, groupIndex) => (
                    <React.Fragment>
                      {group.map((pad, i) => (
                        <div
                          key={`rhythm-pad-group-${i}`}
                          className={cx("modifiedPad", {
                            active:
                              groupIndex ===
                              (((props.step - 1) % props.steps) + props.steps) % props.steps,
                            on: pad === 1,
                          })}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
                {renderPad()}
                </>

            )}


          </div>
          ))
        }

      </div>

    </div>
)}
