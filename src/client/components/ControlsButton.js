import * as React from "react"

const SvgComponent = (props) => (
  <button {...props}>
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#a)">
      <path
        d="M3.334 17.5v-5.833m0-3.334V2.5m6.667 15V10m0-3.333V2.5m6.666 15v-4.167m0-3.333V2.5M.834 11.667h5m1.667-5h5m1.666 6.666h5"
        stroke={props.fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
  </button>
)

export default SvgComponent
