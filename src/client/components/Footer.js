import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "@material-ui/core/Slider";
import ShareModal from "./ShareModal";
import EmailModal from "./EmailModal";
import { ThemeProvider } from "@material-ui/styles";
import PlayCircleIcon from "../images/PlayCircleIcon.svg";
import StopCircleIcon from "../images/StopCircleIcon.svg";
import SkipIcon from "../images/skip.svg";
import { createTheme } from "@material-ui/core/styles";
import ControlsButton from "./ControlsButton";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import "../css/footer.css";

export default function Footer(props) {
  const {
    shareURL,
    setVolume,
    volume,
    clearSelections,
    playing,
    playMix,
    setOpenControls,
    openControls,
    handleSlide,
    currentNFTIndex,
    nftCount
  } = props;
  const { chainId } = useWeb3React();
  const params = useParams();
  const [isBouquet, setIsBouquet] = useState(true);
  const [isProcess, setIsProcess] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const [openEmail, setOpenEmail] = useState(false);

  useEffect(() => {
    if (!chainId) return;

    axios.get("/api/getBouquetStatus", {
      params: {
        tokenId: params.edition,
        chainId 
      }
    }). then((res) => {

      setIsBouquet(res.data);
    })
  }, [chainId])
  const handleClose = () => {
    setOpenShare(false);
  };
  const handleClickOpenEmail = () => {
    setOpenEmail(true);
  };

  const handleCloseEmail = () => {
    setOpenEmail(false);
  };

  const muiTheme = createTheme({
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

  const toggleMusic = async() => {
    if (isProcess) return;
    setIsProcess(true);

    axios.post("/api/updateBouquetStatus", {
      tokenId: params.edition,
      isBouquet: !isBouquet,
      chainId
    }). then(() => {
      setIsBouquet(!isBouquet);
    }).finally(()=> {
      setIsProcess(false);
    })
  }
  return (
    <React.Fragment>
      <ShareModal shareURL={shareURL} onClose={handleClose} open={openShare} />
      <EmailModal onClose={handleCloseEmail} open={openEmail} />
        <div
          className={
            props.white ? "bottomNav scrollBar white" : "bottomNav scrollBar"
          }
        >

        <div className="volumeWrapper">
          <ThemeProvider theme={muiTheme}>
            <Slider
              min={-50}
              max={0}
              defaultValue={volume}
              onChange={(event, newValue) => setVolume(newValue)}
            />
          </ThemeProvider>
        </div>

          
        <div className="play-controls">


          {handleSlide &&
            <a href="#" onClick={() => handleSlide("prevNFT")}>
              <img
                src={SkipIcon}
                style={{ height: "36px", transform: "rotate(180deg)", opacity:  currentNFTIndex == 0 ? "0.5" : "1.0", cursor:  currentNFTIndex == 0 ? "not-allowed" : "pointer" }}
              />
            </a>
          }

          <div className="stopBtnContainer">
            <div className="stopBtnWrapper">
              {playing ? (
                <span
                  style={{
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <a href="#" onClick={clearSelections}>
                    <img src={StopCircleIcon} style={{ height: "36px"}} />
                  </a>
                </span>
              ) : (
                <a href="#" onClick={playMix}>
                  <img
                    src={PlayCircleIcon}
                    style={{ height: "36px"}}
                  />
                </a>
              )}
            </div>
          </div>

          {
            handleSlide &&
            <a href="#" onClick={() => handleSlide("nextNFT")}>
              <img
                src={SkipIcon}
                style={{ height: "36px", opacity:  currentNFTIndex == (nftCount - 1) ? "0.5" : "1.0", cursor:  currentNFTIndex == (nftCount - 1) ? "not-allowed" : "pointer" }}
              />
            </a>
          }
        </div>
            
        <div style={{maxWidth: "440px", paddingLeft: "16px", width: "100%", display:"flex", justifyContent:"flex-end"}}>
          {
            params.artistName == "Capsule" && 
            (
              <button
                onClick={() => toggleMusic()}
                id="wallet-button"
                className="metamask-button small toggle-music"
              >
                {
                  isProcess ? "Upating URI" : (
                    isBouquet ? "Hide Music" : "Show Music"
                  )
                }
            </button>
            )
          }
          
            <ControlsButton
              className={`cta-button small ${
                openControls ? "white" : "light-dark"
              }`}
              onClick={setOpenControls}
              fill={openControls ? "#575757" : "#FFF"}
            />
        </div>
          
        </div>
    </React.Fragment>
  );
}
