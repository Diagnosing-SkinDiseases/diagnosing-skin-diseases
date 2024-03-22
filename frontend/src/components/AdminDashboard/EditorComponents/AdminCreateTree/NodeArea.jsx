import {
  faAngleDown,
  faAngleUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import "./styles/AdminCreateTrees.css";
import { useState } from "react";
import YesNodeArea from "./NodeAreas/YesNodeArea";
import NoNodeArea from "./NodeAreas/NoNodeArea";
import styles from "./styles/styles";
import RootNodeArea from "./NodeAreas/RootNodeArea";

const NodeArea = ({ rootNode, setRootNode }) => {
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
    let allNodes = collectAllNodes(rootNode);
    console.log("All Nodes:", allNodes);
  }, [rootNode]);

  // Node ID state
  const [idCounter, setIdCounter] = useState(0);
  return (
    <>
      <RootNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
        allNodes={collectAllNodes(rootNode)}
      ></RootNodeArea>
      <YesNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
        allNodes={collectAllNodes(rootNode)}
      ></YesNodeArea>
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
