import React from "react";

import { useState, useEffect } from "react";

/**
 * Component to display and edit the length of an arrow in the tree editor.
 */
const LengthControls = ({
  selectedNode,
  rootNode,
  findTreeNodeById,
  setRootNode,
  setNodes,
  multiSelectOn,
  multiSelectList,
}) => {
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
    return Math.round(length); // Return the rounded length
  }

  // Logging
  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    let parentNode = findTreeNodeById(rootNode, selectedNode.parentId);

    if (parentNode) {
      calculateArrowLength(
        parentNode.xPos,
        parentNode.yPos,
        selectedNode.xPos,
        selectedNode.yPos
      );
    } else {
      if (multiSelectOn) return;
      setLengthInput(0);
    }
  }, [selectedNode]);

  /**
   * Custom arrow length handling
   */
  const [lengthInput, setLengthInput] = useState(0);

  useEffect(() => {
    if (selectedNode && selectedNode.parentId) {
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

  // Handle input controls
  const handleInputChange = (event) => {
    setLengthInput(event.target.value);
  };

  /**
   * Manually change the "length" of a node's arrow relative to its parent.
   */
  const changeSelectedNodeLength = () => {
    const updatePositionRecursively = (node) => {
      if (!multiSelectOn) {
        // Single node logic
        if (node.currentId === selectedNode.currentId) {
          const parentNode = findTreeNodeById(rootNode, selectedNode.parentId);

          if (!parentNode) {
            console.error("Parent node not found");
            return node;
          }

          // Calculate new X and Y based on the arrow length
          const angle = Math.atan2(
            node.yPos - parentNode.yPos,
            node.xPos - parentNode.xPos
          ); // Calculate the angle between parent and current node

          const newXPos = parentNode.xPos + lengthInput * Math.cos(angle);
          const newYPos = parentNode.yPos + lengthInput * Math.sin(angle);

          // Update the visual position of the node
          setNodes((nds) =>
            nds.map((nd) =>
              nd.id === selectedNode.currentId
                ? { ...nd, position: { x: newXPos, y: newYPos } }
                : nd
            )
          );

          return { ...node, xPos: newXPos, yPos: newYPos };
        }
      } else {
        // Multi-select logic
        const isInMultiSelectList = multiSelectList.some(
          (multiNode) => multiNode.currentId === node.currentId
        );

        let updatedNode = node;

        if (isInMultiSelectList) {
          const parentNode = findTreeNodeById(rootNode, node.parentId);

          if (!parentNode) {
            console.error(
              "Parent node not found for multi-select node",
              node.currentId
            );
            return node;
          }

          // Calculate new X and Y based on the arrow length
          const angle = Math.atan2(
            node.yPos - parentNode.yPos,
            node.xPos - parentNode.xPos
          ); // Calculate the angle between parent and current node

          const newXPos = parentNode.xPos + lengthInput * Math.cos(angle);
          const newYPos = parentNode.yPos + lengthInput * Math.sin(angle);

          // Update the visual position of the node
          setNodes((nds) =>
            nds.map((nd) =>
              nd.id === node.currentId
                ? { ...nd, position: { x: newXPos, y: newYPos } }
                : nd
            )
          );

          updatedNode.xPos = newXPos;
          updatedNode.yPos = newYPos;
        }
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

  const handleSubmitNewLength = (event) => {
    if (event.key === "Enter") {
      const newLength = parseInt(lengthInput, 10);
      changeSelectedNodeLength(newLength);
    }
  };

  return (
    <>
      <span className="tree-flow-panel-label">Length: </span>
      <input
        type={"text"}
        className="tree-flow-panel-length-input"
        value={lengthInput}
        onChange={handleInputChange}
        onKeyDown={handleSubmitNewLength}
      />
    </>
  );
};

export default LengthControls;
