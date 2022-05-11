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

    console.log("index should be : " + sectionIndex + " actual index is: " + visibleSectionIndex.current)

  }
  const mediaFileExtension = (nft) => {
     return nft.imageURL
     .split(".")
     .pop()
     .toLowerCase();
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
                          key={`pad-group-${i}`}
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

                <div className={`gridOuter ${props.padFormatStyleClass} carousel`}>
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
                        } else if (props.tutorialStep === 1 && group !== "basses") {
                          tutorialClass = "tutorialPad";
                        } else if (props.tutorialStep === 2 && group !== "sounds") {
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
                            props.togglePad(group, soundIndex);
                          }}
                        />
                      );
                    });
                  })}
                </div>
                </>

            )}


          </div>
          ))
        }

      </div>

    </div>
)}
