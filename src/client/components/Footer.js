import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import "../css/footer.css";

export default function Footer(props) {
  return (
    <React.Fragment>
      <div
        className={
          props.white ? "bottomNav scrollBar white" : "bottomNav scrollBar"
        }
      >
        <a href="/directory">
          <div className="bottomItem">DIRECTORY</div>
        </a>
        <a href="/artists">
          <div className="bottomItem">ARTISTS</div>
        </a>
        <a href="/mybeats">
          <div className="bottomItem">MY BEATS</div>
        </a>
        <a href="/profile">
          <div className="bottomItem">PROFILE</div>
        </a>
      </div>
    </React.Fragment>
  );
}
