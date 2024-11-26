import React from "react";

import { useState, useEffect } from "react";

const LengthControls = (props) => {
  return (
    <>
      <span className="tree-flow-panel-label">Length: </span>
      <input type={"text"} className="tree-flow-panel-length-input" />
    </>
  );
};

export default LengthControls;
