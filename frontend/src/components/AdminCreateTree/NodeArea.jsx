import {
  faAngleDown,
  faAngleUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./AdminCreateTrees.css";
import { useState } from "react";

const NodeArea = ({ rootNode, setRootNode }) => {
  // Node ID state
  const [idCounter, setIdCounter] = useState(0);

  const generateNodeId = () => {
    setIdCounter((prevVal) => prevVal + 1);
    return `node${idCounter + 1}`;
  };

  // Node interaction handlers
  const updateNodeContent = (nodeIdToUpdate, newContent) => {
    const updateContentRecursively = (node) => {
      if (node.currentId === nodeIdToUpdate) {
        return { ...node, content: newContent };
      }

      // Recursively process both noChild and yesChild arrays
      const updatedNoChild = node.noChild.map(updateContentRecursively);
      const updatedYesChild = node.yesChild.map(updateContentRecursively);

      return {
        ...node,
        noChild: updatedNoChild,
        yesChild: updatedYesChild,
      };
    };

    setRootNode((prevRootNode) => updateContentRecursively(prevRootNode));
  };

  const onChangeNodeContent = (event) => {
    const newContent = event.target.value;
    const nodeIdToUpdate = event.target.nodeid;
    updateNodeContent(nodeIdToUpdate, newContent);
  };

  function generateNode(content) {
    const newId = generateNodeId();
    const newNode = {
      currentId: newId,
      content: content,
      parentId: null,
      noChild: [],
      yesChild: [],
    };
    return newNode;
  }

  return (
    <>
      <div className="root-node-section-container">
        <h3>Root Node</h3>
        <h3 style={{ color: "red" }}>{}</h3>
        <div className="white-bar-input-dropdown-container">
          <input
            className="white-bar-input-dropdown"
            type="text"
            placeholder="Enter Root Node question"
            value={rootNode.content}
            nodeid={rootNode.currentId}
            onChange={onChangeNodeContent}
          />
          <button className="dropdown-button">
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </div>
      </div>
    </>
  );
};

export default NodeArea;
