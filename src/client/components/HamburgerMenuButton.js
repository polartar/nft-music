import * as React from "react"

const SvgComponent = (props) => (
  <button {...props}>
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"

  >
    <path
      d="M3 12h18M3 6h18M3 18h18"
      stroke={props.stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  </button>

)

export default SvgComponent
