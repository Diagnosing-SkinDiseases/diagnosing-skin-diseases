import React, { useState, useEffect } from "react";

/**
 * Component to display and edit the angle of an arrow in the tree editor.
 */
const AngleControls = ({
  selectedNode,
  rootNode,
  findTreeNodeById,
  setRootNode,
  setNodes,
  multiSelectOn,
  multiSelectList,
}) => {
  /**
   * Calculates the angle between two nodes.
   * @param {number} parentX - The x-coordinate of the parent node.
   * @param {number} parentY - The y-coordinate of the parent node.
   * @param {number} currentX - The x-coordinate of the current node.
   * @param {number} currentY - The y-coordinate of the current node.
   */
  function calculateAngle(parentX, parentY, currentX, currentY) {
    // Standard angle calculation using atan2
    let angle =
      (Math.atan2(currentY - parentY, currentX - parentX) * 180) / Math.PI;

    // Adjust angle so that directly below is 0° and directly to the right is 90°
    angle = (angle + 360) % 360; // Normalize to [0, 360)
    angle = (450 - angle) % 360; // Rotate 90° clockwise to make 0° directly below
    return Math.round(angle);
  }

  // Logging
  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    let parentNode = findTreeNodeById(rootNode, selectedNode.parentId);
  }, [selectedNode]);

  // Logging 2
  useEffect(() => {}, [selectedNode]);

  /**
   * Custom angle handling
   */
  const [angleInput, setAngleInput] = useState(0);

  useEffect(() => {
    if (selectedNode && selectedNode.parentId) {
      const parentNode = findTreeNodeById(rootNode, selectedNode.parentId);
      const currentNode = findTreeNodeById(rootNode, selectedNode.currentId);
      let isNoNode = false;
      if (parentNode.noChild[0] !== undefined) {
        isNoNode = parentNode.noChild[0].currentId === selectedNode.currentId;
      }

      if (parentNode && currentNode) {
        let displayAngle = calculateAngle(
          parentNode.xPos,
          parentNode.yPos,
          currentNode.xPos,
          currentNode.yPos
        );
        if (!isNoNode) {
          setAngleInput(displayAngle);
        } else {
          setAngleInput(360 - displayAngle);
        }
      }
    } else {
      if (multiSelectOn) return;
      setAngleInput(0);
    }
  }, [selectedNode, rootNode]);

  // Handle input controls
  const handleInputChange = (event) => {
    setAngleInput(event.target.value);
  };

  /**
   * Manually change the "angle" of a node's arrow relative to its parent.
   */
  const changeSelectedNodeAngle = (newAngle) => {
    const updatePositionRecursively = (node) => {
      if (!multiSelectOn) {
        // Single node logic
        if (node.currentId === selectedNode.currentId) {
          const parentNode = findTreeNodeById(rootNode, selectedNode.parentId);

          if (!parentNode) {
            console.error("Parent node not found");
            return node;
          }

          let isNoNode = false;
          if (parentNode.noChild[0] !== undefined) {
            isNoNode = parentNode.noChild[0].currentId === node.currentId;
          }

          // Adjust the angle to use the positive x-axis as 90°, normalize to [0, 360)
          let adjustedAngle = (((450 - newAngle) % 360) + 360) % 360;

          // Mirror the angle if the node is a "No" node
          if (isNoNode) {
            adjustedAngle = (360 - adjustedAngle) % 360;
          }

          const radians = (adjustedAngle * Math.PI) / 180; // Convert adjusted angle to radians

          // Calculate distance between parent and current node
          const distance = Math.sqrt(
            Math.pow(node.xPos - parentNode.xPos, 2) +
              Math.pow(node.yPos - parentNode.yPos, 2)
          );

          // Calculate new X and Y positions based on adjusted angle
          const newXPos = isNoNode
            ? parentNode.xPos - distance * Math.cos(radians)
            : parentNode.xPos + distance * Math.cos(radians);

          const newYPos = isNoNode
            ? parentNode.yPos - distance * Math.sin(radians) // "No" node: add Y component
            : parentNode.yPos + distance * Math.sin(radians); // "Yes" node: subtract Y component

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

        // Recursively process both noChild and yesChild arrays
        const updatedNoChild = node.noChild.map(updatePositionRecursively);
        const updatedYesChild = node.yesChild.map(updatePositionRecursively);

        return {
          ...node,
          noChild: updatedNoChild,
          yesChild: updatedYesChild,
        };
      } else {
        // Multi-select logic
        const isInMultiSelectList = multiSelectList.some(
          (multiNode) => multiNode.currentId === node.currentId
        );

        let updatedNode = node;

        if (isInMultiSelectList) {
          const parentNode = findTreeNodeById(rootNode, node.parentId);

          if (parentNode) {
            const isNoNode =
              parentNode.noChild[0]?.currentId === node.currentId;

            // Adjust the angle to use the positive x-axis as 90°, normalize to [0, 360)
            let adjustedAngle = (((450 - newAngle) % 360) + 360) % 360;

            // Mirror the angle if the node is a "No" node
            if (isNoNode) {
              adjustedAngle = (360 - adjustedAngle) % 360;
            }

            const radians = (adjustedAngle * Math.PI) / 180; // Convert adjusted angle to radians

            // Calculate distance between parent and current node
            const distance = Math.sqrt(
              Math.pow(node.xPos - parentNode.xPos, 2) +
                Math.pow(node.yPos - parentNode.yPos, 2)
            );

            // Calculate new X and Y positions based on adjusted angle
            const newXPos = isNoNode
              ? parentNode.xPos - distance * Math.cos(radians)
              : parentNode.xPos + distance * Math.cos(radians);

            const newYPos = isNoNode
              ? parentNode.yPos - distance * Math.sin(radians) // "No" node: add Y component
              : parentNode.yPos + distance * Math.sin(radians); // "Yes" node: subtract Y component

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
      }
    };

    setRootNode((prevRootNode) => updatePositionRecursively(prevRootNode));
  };

  const handleSubmitNewAngle = (event) => {
    if (event.key === "Enter") {
      const newAngle = parseInt(angleInput, 10);
      changeSelectedNodeAngle(newAngle);
    }
  };

  return (
    <>
      <span className="tree-flow-panel-label">Angle: </span>
      <input
        type={"text"}
        className="tree-flow-panel-angle-input"
        value={angleInput}
        onChange={handleInputChange}
        onKeyDown={handleSubmitNewAngle}
      />
    </>
  );
};

export default AngleControls;
