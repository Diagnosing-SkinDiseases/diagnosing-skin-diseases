import React from "react";

import { useState, useEffect } from "react";

const LengthControls = ({ selectedNode, rootNode, findTreeNodeById }) => {
  // Logging
  useEffect(() => {
    console.log("Length controls selected node", selectedNode);
    console.log(
      "Selected parent:",
      findTreeNodeById(rootNode, selectedNode.parentId)
    );
  }, [selectedNode]);

  return (
    <>
      <span className="tree-flow-panel-label">Length: </span>
      <input type={"text"} className="tree-flow-panel-length-input" />
    </>
  );
};

export default LengthControls;
