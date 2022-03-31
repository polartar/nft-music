import React, { useState, useEffect } from "react";
import Lily from "./Lily";
import Chrysanthemum from "./Chrysanthemum";
import Hyacinth from "./Hyacinth";
import Carnation from "./Carnation";
import QuakingGrass from "./QuakingGrass";
import MonsteraLeaf from "./MonsteraLeaf";
import Tulip from "./Tulip";

export default function FlowerArrangement(props) {

  return (
    <React.Fragment>
      <Lily className="lily animated-content" />
      <Carnation className="carnation animated-content" />
      <Chrysanthemum className="chrysanthemum" />
      <Hyacinth className="hyacinth animated-content" />
      <QuakingGrass className="quaking-grass animated-content" />
    </React.Fragment>

  );
}

FlowerArrangement.propTypes = {

};
