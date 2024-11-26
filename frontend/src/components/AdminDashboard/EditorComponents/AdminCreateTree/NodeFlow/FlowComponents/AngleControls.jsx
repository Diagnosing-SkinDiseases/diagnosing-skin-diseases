import React from "react";

import { useState, useEffect } from "react";

const AngleControls = (props) => {
  return (
    <>
      <span className="tree-flow-panel-label">Angle: </span>
      <input type={"text"} className="tree-flow-panel-angle-input" />
    </>
  );
};

export default AngleControls;
