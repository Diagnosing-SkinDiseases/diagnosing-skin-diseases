import React, { useEffect } from "react";
import styles from "../styles/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

const NodeEditor = ({
  rootNode,
  setRootNode,
  currentNode,
  idCounter,
  setIdCounter,
}) => {
  // Dropdown State
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Dropdown Interaction handlers
  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const generateNodeId = () => {
    setIdCounter((prevVal) => prevVal + 1);
    return `node${idCounter + 1}`;
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

  const addYesChild = (targetNodeId, nodeToInsert) => {
    const addYesChildToTarget = (node) => {
      if (node.currentId === targetNodeId) {
        // Match found, create a new node with updated yesChild array
        return {
          ...node,
          yesChild: node.yesChild.concat(nodeToInsert), // concat returns a new array
        };
      } else if (node.noChild.length || node.yesChild.length) {
        // No match, but the node has children. Attempt to update children.
        return {
          ...node,
          noChild: node.noChild.map(addYesChildToTarget),
          yesChild: node.yesChild.map(addYesChildToTarget),
        };
      }
      // No match and no children to update, return node as is
      return node;
    };

    // Create a new root node with updated structure
    let newRootNode = addYesChildToTarget(rootNode);
    setRootNode(newRootNode); // This should trigger a re-render
  };

  const addNoChild = (targetNodeId, nodeToInsert) => {
    const addNoChildToTarget = (node) => {
      if (node.currentId === targetNodeId) {
        nodeToInsert.parentId = targetNodeId;
        return {
          ...node,
          noChild: [...node.noChild, nodeToInsert],
        };
      }
      // Recursively process both noChild and yesChild arrays
      const updatedNoChild = node.noChild.map(addNoChildToTarget);
      const updatedYesChild = node.yesChild.map(addNoChildToTarget);

      return {
        ...node,
        noChild: updatedNoChild,
        yesChild: updatedYesChild,
      };
    };
    const updatedRootNode = addNoChildToTarget(rootNode);
    setRootNode(updatedRootNode);
  };

  const deleteChild = (nodeIdToDelete) => {
    const deleteNodeRecursively = (node) => {
      if (node.currentId === nodeIdToDelete) {
        return null;
      }
      const updatedNoChild = node.noChild.map(deleteNodeRecursively);
      const updatedYesChild = node.yesChild.map(deleteNodeRecursively);
      return {
        ...node,
        noChild: updatedNoChild.filter(Boolean),
        yesChild: updatedYesChild.filter(Boolean),
      };
    };

    const updatedRootNode = deleteNodeRecursively(rootNode);
    setRootNode(updatedRootNode);
  };

  // Button Handlers
  const onChangeNodeContent = (event) => {
    const newContent = event.target.value;
    const nodeIdToUpdate = event.target.getAttribute("data-node-id");
    updateNodeContent(nodeIdToUpdate, newContent);
  };

  const onAddNode = (event) => {
    let newNode = generateNode();
    let targetNodeId = event.target.getAttribute("data-node-id");
    let addType = event.target.getAttribute("data-node-type");
    newNode.parentId = targetNodeId;
    if (addType === "yes") {
      newNode.content = document.getElementById(
        `yesInput${currentNode.currentId}`
      ).value;
      addYesChild(targetNodeId, newNode);
    } else {
      newNode.content = document.getElementById(
        `noInput${currentNode.currentId}`
      ).value;
      addNoChild(targetNodeId, newNode);
    }
  };

  const onDeleteNode = (event) => {
    let targetNodeId = event.target.getAttribute("data-node-id");
    deleteChild(targetNodeId);
  };

  return (
    <>
      {/* Input box */}
      <div className="white-bar-input-dropdown-container">
        <input
          className="white-bar-input-dropdown"
          type="text"
          placeholder="Enter Root Node question"
          value={currentNode.content}
          data-node-id={currentNode.currentId}
          onChange={onChangeNodeContent}
        />
        {/* Dropdown Button */}
        <button className="dropdown-button" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={dropdownVisible ? faAngleUp : faAngleDown} />
        </button>
        {/* Delete button (disabled for root node) */}
        {currentNode.parentId != null && (
          <button
            style={styles.deleteButton}
            data-node-id={currentNode.currentId}
            onClick={onDeleteNode}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        )}
      </div>

      {/* Yes and No add node dropdown */}
      {dropdownVisible && (
        <div className="additional-inputs-container">
          <div className="additional-input-with-button">
            <input
              className="white-bar-input-dropdown-additional"
              type="text"
              placeholder="Enter Yes Node Question"
              id={`yesInput${currentNode.currentId}`}
            />
            <button
              className="yes-node-button"
              data-node-type="yes"
              onClick={onAddNode}
              data-node-id={currentNode.currentId}
            >
              Add Yes Node
            </button>
          </div>
          <div className="additional-input-with-button">
            <input
              className="white-bar-input-dropdown-additional"
              type="text"
              placeholder="Enter No Node Question"
              id={`noInput${currentNode.currentId}`}
            />
            <button
              className="no-node-button"
              data-node-type="no"
              onClick={onAddNode}
              data-node-id={currentNode.currentId}
            >
              Add No Node
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NodeEditor;
