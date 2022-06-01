import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.79 15.823a1.496 1.496 0 0 0 1.538-.075l6.756-4.502a1.498 1.498 0 0 0 0-2.493L6.328 4.252A1.499 1.499 0 0 0 4 5.498V14.5c0 .552.303 1.06.79 1.322ZM15.576 15.856a1.227 1.227 0 0 0 1.226-1.225V5.369a1.226 1.226 0 1 0-2.452 0v9.262c.001.676.55 1.224 1.226 1.225Z"
      fill={props.fill}
    />
  </svg>
)

export default SvgComponent
