import React from "react";

import { useState, useEffect } from "react";

/**
 * Component to display and edit the length of an arrow in the tree editor.
 */
const LengthControls = ({ selectedNode, rootNode, findTreeNodeById }) => {
  /**
   * Calculates and prints the arrow length between two nodes.
   * @param {number} parentX - The x-coordinate of the parent node.
   * @param {number} parentY - The y-coordinate of the parent node.
   * @param {number} currentX - The x-coordinate of the current node.
   * @param {number} currentY - The y-coordinate of the current node.
   */
  function calculateArrowLength(parentX, parentY, currentX, currentY) {
    const length = Math.sqrt(
      Math.pow(currentX - parentX, 2) + Math.pow(currentY - parentY, 2)
    );
    console.log(`Arrow Length: ${length.toFixed(2)}`);
    return Math.round(length); // Return the rounded length
  }

  // Logging
  useEffect(() => {
    console.log("Length controls selected node", selectedNode);
    console.log(
      "Selected parent:",
      findTreeNodeById(rootNode, selectedNode.parentId)
    );
    let parentNode = findTreeNodeById(rootNode, selectedNode.parentId);

    if (parentNode) {
      calculateArrowLength(
        parentNode.xPos,
        parentNode.yPos,
        selectedNode.xPos,
        selectedNode.yPos
      );
    }
  }, [selectedNode]);

  /**
   * Custom arrow length handling
   */
  const [lengthInput, setLengthInput] = useState(0);

  useEffect(() => {
    if (selectedNode && selectedNode.parentId) {
      console.log("Recalculating length...");
      const parentNode = findTreeNodeById(rootNode, selectedNode.parentId);
      const currentNode = findTreeNodeById(rootNode, selectedNode.currentId);
      if (parentNode && currentNode) {
        setLengthInput(
          calculateArrowLength(
            parentNode.xPos,
            parentNode.yPos,
            currentNode.xPos,
            currentNode.yPos
          )
        );
      }
    }
  }, [selectedNode, rootNode]);

  return (
    <>
      <span className="tree-flow-panel-label">Length: </span>
      <input
        type={"text"}
        className="tree-flow-panel-length-input"
        value={lengthInput}
      />
    </>
  );
};

export default LengthControls;
