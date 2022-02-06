/* eslint-disable react/no-unused-state, react/no-array-index-key */
import axios from "axios";
import cx from "classnames";
import React, { Component, createRef } from "react";
import * as Tone from "tone";
import Loading from "./components/Loading";
import WaterLoop from "./images/waterScaleLoop.mp4";

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
  render() {
    return (
      <iframe
        sandbox="allow-scripts"
        src="https://localhost:3001/sequencer"
      ></iframe>
    );
  }
}

export default Sequencer;
