import React, { useState, useEffect } from "react";

export default function Stopwatch(props) {

  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval = null;
    // if(this.props.running) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      }, 10)
    // }
    // else {
      // clearInterval(interval);
    // }
    return () => clearInterval( interval)
  }, [])

  return (
    <div className={'stopwatch'}>
      <div className={"stopwatch__display"}>
      <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}: </span>
      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}: </ span>
      <span>{("0" + (time / 10) % 1000) .slice(-2)}</span>
    </div>
    </div>
  );

}
