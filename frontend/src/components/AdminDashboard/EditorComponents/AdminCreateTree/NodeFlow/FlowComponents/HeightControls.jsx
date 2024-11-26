import React from "react";
import { useState, useEffect } from "react";

const HeightControls = ({
  initialY,
  setInitialY,
  lockedY,
  setLockedY,
  selectedNode,
  findTreeNodeById,
  rootNode,
  setRootNode,
  nodes,
  setNodes,
}) => {
  // Toggle y lock
  const toggleYLock = () => {
    setLockedY((prevState) => !prevState);
  };

  /**
   * Custom Height Handling
   */

  const [heightInput, setHeightInput] = useState(0);

  useEffect(() => {
    if (selectedNode && selectedNode.parentId) {
      const parentNode = findTreeNodeById(rootNode, selectedNode.parentId);
      const currentNode = findTreeNodeById(rootNode, selectedNode.currentId);
      if (parentNode && currentNode) {
        setHeightInput(Math.round(currentNode.yPos - parentNode.yPos));
      }
    }
  }, [selectedNode, rootNode]);

  // Handle input controls
  const handleInputChange = (event) => {
    setHeightInput(event.target.value);
  };

  /**
   * Manually change the "height" of a node relative to its parent.
   */
  const changeSelectedNodeHeight = (newHeight) => {
    const updatePositionRecursively = (node) => {
      if (node.currentId === selectedNode.currentId) {
        const newYPos =
          findTreeNodeById(rootNode, selectedNode.parentId).yPos + newHeight;

        // Update the visual position of the node
        setNodes((nds) => {
          let newVisualNodes = nds.map((nd) => {
            if (nd.id === selectedNode.currentId) {
              return { ...nd, position: { x: nd.position.x, y: newYPos } };
            }
            return nd;
          });
          return newVisualNodes;
        });

        return { ...node, xPos: node.xPos, yPos: newYPos };
      }

      // Recursively process both noChild and yesChild arrays
      const updatedNoChild = node.noChild.map(updatePositionRecursively);
      const updatedYesChild = node.yesChild.map(updatePositionRecursively);

      return {
        ...node,
        noChild: updatedNoChild,
        yesChild: updatedYesChild,
      };
    };

    setRootNode((prevRootNode) => updatePositionRecursively(prevRootNode));
  };

  const handleSubmitNewHeight = (event) => {
    if (event.key === "Enter") {
      const newHeight = parseInt(heightInput, 10);
      changeSelectedNodeHeight(newHeight);
    }
  };

  return (
    <>
      <button
        style={{ margin: "5px" }}
        onClick={toggleYLock}
        className={lockedY ? "tree-flow-panel-button-locked" : ""}
      >
        Lock Height
      </button>
      <span className="tree-flow-panel-label">Height: </span>
      <input
        type={"text"}
        value={heightInput}
        onChange={handleInputChange}
        onKeyDown={handleSubmitNewHeight}
        className="tree-flow-panel-height-input"
      />
    </>
  );
};

export default HeightControls;
