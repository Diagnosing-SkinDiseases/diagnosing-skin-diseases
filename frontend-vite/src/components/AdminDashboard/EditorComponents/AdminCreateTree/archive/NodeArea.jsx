import React, { useEffect } from "react";
import "./styles/AdminCreateTrees.css";
import { useState } from "react";
import YesNodeArea from "./NodeAreas/YesNodeArea";
import NoNodeArea from "./NodeAreas/NoNodeArea";
import RootNodeArea from "./NodeAreas/RootNodeArea";

/**
 * NodeArea component renders the areas for managing nodes in the decision tree.
 * @param {Object} props - The props object containing properties passed to the component.
 * @param {Object} props.rootNode - The root node of the decision tree.
 * @param {Function} props.setRootNode - Function to set the root node of the decision tree.
 * @returns {JSX.Element} - Returns the JSX element for the NodeArea component.
 */
const NodeArea = ({ rootNode, setRootNode }) => {
  /**
   * Recursively collects all nodes in the decision tree.
   * @param {Object} node - The current node being processed.
   * @param {Set} uniqueNodes - A Set to store unique node IDs.
   * @returns {Array} - Returns an array containing all nodes in the decision tree.
   */
  function collectAllNodes(node, uniqueNodes = new Set()) {
    let allNodes = [];

    if (node) {
      // Check if the node ID is already in the Set
      if (!uniqueNodes.has(node.currentId)) {
        // If not, add it to the Set and push the node to the result array
        if (node.parentId !== null) {
          uniqueNodes.add(node.currentId);
          allNodes.push(node);
        }
      }

      // Recursively collect nodes from the "yes" children
      if (node.yesChild && node.yesChild.length > 0) {
        node.yesChild.forEach((child) => {
          // Pass the uniqueNodes Set to the recursive call
          allNodes = allNodes.concat(collectAllNodes(child, uniqueNodes));
        });
      }

      // Recursively collect nodes from the "no" children
      if (node.noChild && node.noChild.length > 0) {
        node.noChild.forEach((child) => {
          // Pass the uniqueNodes Set to the recursive call
          allNodes = allNodes.concat(collectAllNodes(child, uniqueNodes));
        });
      }
    }

    return allNodes;
  }

  useEffect(() => {
    // Collect all nodes when the rootNode prop changes
    let allNodes = collectAllNodes(rootNode);
  }, [rootNode]);

  // Node ID state
  const [idCounter, setIdCounter] = useState(0);

  return (
    <>
      {/* Render RootNodeArea */}
      <RootNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
        allNodes={collectAllNodes(rootNode)}
      ></RootNodeArea>
      {/* Render YesNodeArea */}
      <YesNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
        allNodes={collectAllNodes(rootNode)}
      ></YesNodeArea>
      {/* Render NoNodeArea */}
      <NoNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
        allNodes={collectAllNodes(rootNode)}
      ></NoNodeArea>
    </>
  );
};

export default NodeArea;
