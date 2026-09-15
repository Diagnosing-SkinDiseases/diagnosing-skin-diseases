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
  multiSelectOn,
  multiSelectList,
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

    // Special root node controls
    if (selectedNode) {
      if (selectedNode.currentId === "node0") {
        const currentNode = findTreeNodeById(rootNode, selectedNode.currentId);
        setHeightInput(Math.round(currentNode.yPos));
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
      if (!multiSelectOn) {
        // Unique Root node logic
        if (selectedNode.currentId === "node0") {
          const newYPos = newHeight;

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

        // Single node logic
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
      } else {
        // Multi-select logic
        const isInMultiSelectList = multiSelectList.some((multiNode) => {
          return multiNode.currentId === node.currentId;
        });

        let updatedNode = node;

        if (isInMultiSelectList) {
          const parentNode = findTreeNodeById(rootNode, node.parentId);

          if (parentNode) {
            const newYPos = parentNode.yPos + newHeight;

            // Update the visual position of the node
            setNodes((nds) => {
              let newVisualNodes = nds.map((nd) => {
                if (nd.id === node.currentId) {
                  return { ...nd, position: { x: nd.position.x, y: newYPos } };
                }
                return nd;
              });
              return newVisualNodes;
            });

            updatedNode.yPos = newYPos;
          }
        }
        // Recursively process both noChild and yesChild arrays
        const updatedNoChild = node.noChild.map(updatePositionRecursively);
        const updatedYesChild = node.yesChild.map(updatePositionRecursively);

        return {
          ...updatedNode,
          noChild: updatedNoChild,
          yesChild: updatedYesChild,
        };
      }
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
