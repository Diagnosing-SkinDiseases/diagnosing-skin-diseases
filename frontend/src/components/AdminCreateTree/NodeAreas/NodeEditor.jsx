import React from "react";
import styles from "../styles/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

const NodeEditor = ({ rootNode, setRootNode, nodeId }) => {
  // Dropdown State
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Dropdown Interaction handlers
  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

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
    const nodeIdToUpdate = event.target.getAttribute("data-nodeid");
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
      <div className="white-bar-input-dropdown-container">
        <input
          className="white-bar-input-dropdown"
          type="text"
          placeholder="Enter Root Node question"
          value={rootNode.content}
          data-nodeid={nodeId}
          onChange={onChangeNodeContent}
        />
        <button className="dropdown-button" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={dropdownVisible ? faAngleUp : faAngleDown} />
        </button>
      </div>

      {/* Yes and No add node dropdown */}
      {dropdownVisible && (
        <div className="additional-inputs-container">
          <div className="additional-input-with-button">
            <input
              className="white-bar-input-dropdown-additional"
              type="text"
              placeholder="Enter Yes Node Question"
              id="yes-node-input"
            />
            <button className="yes-node-button">Add Yes Node</button>
          </div>
          <div className="additional-input-with-button">
            <input
              className="white-bar-input-dropdown-additional"
              type="text"
              placeholder="Enter No Node Question"
              id="no-node-input"
            />
            <button className="no-node-button">Add No Node</button>
          </div>
        </div>
      )}
    </>
  );
};

export default NodeEditor;
