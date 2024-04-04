import React, { useState, useEffect } from "react";
import styles from "../styles/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// Component to edit a single node
const NodeEditor = ({
  rootNode,
  setRootNode,
  currentNode,
  idCounter,
  setIdCounter,
  allNodes,
}) => {
  // Dropdown State
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [existingDropdownVisibleYes, setExistingDropdownVisibleYes] =
    useState(false);
  const [existingDropdownVisibleNo, setExistingDropdownVisibleNo] =
    useState(false);

  // Dropdown Interaction handlers
  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const toggleExistingDropdownYes = () => {
    setExistingDropdownVisibleYes((prevState) => !prevState);
  };

  const toggleExistingDropdownNo = () => {
    setExistingDropdownVisibleNo((prevState) => !prevState);
  };

  const generateNodeId = () => {
    setIdCounter((prevVal) => prevVal + 1);
    return `node${idCounter + 1}`;
  };

  // Generate a new node with a unique ID
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

  // Add a new node to the yesChild array of a target node
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

  // Add a new node to the noChild array of a target node
  const addNoChild = (targetNodeId, nodeToInsert) => {
    const addNoChildToTarget = (node) => {
      if (node.currentId === targetNodeId) {
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

  // Delete a child node from the tree
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

  // Add a new node to the tree
  const onAddNode = (event) => {
    let newNode = generateNode();
    let targetNodeId = event.target.getAttribute("data-node-id");
    let addType = event.target.getAttribute("data-node-type");
    newNode.parentId = targetNodeId;

    let targetElement;
    let targetContent;

    if (addType === "yes") {
      targetElement = document.getElementById(`yesInput${targetNodeId}`);
      targetContent = targetElement.value;
      newNode.content = targetContent;
      addYesChild(targetNodeId, newNode);
      document.getElementById(`yesInput${targetNodeId}`).value = "";
    } else {
      targetElement = document.getElementById(`noInput${targetNodeId}`);
      targetContent = targetElement.value;
      newNode.content = targetContent;
      addNoChild(targetNodeId, newNode);
      document.getElementById(`noInput${targetNodeId}`).value = "";
    }
  };

  // Add an existing node to the tree
  const onAddExistingNode = (event, newNode) => {
    let targetNodeId = event.target.getAttribute("data-node-id");
    let addType = event.target.getAttribute("data-node-type");

    if (addType === "yes") {
      addYesChild(targetNodeId, newNode);
    } else {
      addNoChild(targetNodeId, newNode);
    }
  };

  // Delete a node from the tree
  const onDeleteNode = (event) => {
    let targetNodeId = event.currentTarget.getAttribute("data-node-id");
    deleteChild(targetNodeId);
  };

  return (
    <>
      {/* Input box */}
      <div className="white-bar-input-dropdown-container">
        <input
          className="white-bar-input-dropdown"
          type="text"
          placeholder="Enter Node question"
          value={currentNode.content}
          data-node-id={currentNode.currentId}
          onChange={onChangeNodeContent}
          style={
            currentNode.yesChild.length === 0 &&
            currentNode.noChild.length === 0
              ? styles.leafNode
              : null
          }
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
          {/* Yes Children of current node*/}
          {currentNode.yesChild.map((node, index) => {
            return (
              <div className="additional-input-with-button" key={index}>
                <input
                  style={styles.dropdownNodeYesChild}
                  className="white-bar-input-dropdown-additional"
                  type="text"
                  value={node.content}
                  data-node-id={node.currentId}
                  onChange={onChangeNodeContent}
                />
                <button
                  style={styles.deleteButton}
                  data-node-id={node.currentId}
                  onClick={onDeleteNode}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            );
          })}
          {/* No Children of current node*/}
          {currentNode.noChild.map((node, index) => {
            return (
              <div className="additional-input-with-button" key={index}>
                <input
                  style={styles.dropdownNodeNoChild}
                  className="white-bar-input-dropdown-additional"
                  type="text"
                  value={node.content}
                  data-node-id={node.currentId}
                  onChange={onChangeNodeContent}
                />
                <button
                  style={styles.deleteButton}
                  data-node-id={node.currentId}
                  onClick={onDeleteNode}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            );
          })}
          {/* Yes node input */}
          {currentNode.yesChild.length === 0 && (
            <>
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
                {/* Existing Node toggle select */}
                <button
                  className="dropdown-button"
                  onClick={toggleExistingDropdownYes}
                >
                  <FontAwesomeIcon
                    icon={existingDropdownVisibleYes ? faAngleUp : faAngleDown}
                  />
                </button>
              </div>
              {/* Dropdown of existing nodes */}
              {existingDropdownVisibleYes && (
                <div style={styles.existingNodesDropdownContainer}>
                  {allNodes.map((node, index) => {
                    if (node.currentId === currentNode.currentId) {
                      return null;
                    }
                    return (
                      <div
                        style={styles.existingNodesDropdownItem}
                        className="white-bar-input-dropdown-additional existing-nodes-dropdown-item"
                        key={`dropdownItem${index}copy`}
                        data-node-id={currentNode.currentId}
                        data-node-type="yes"
                        onClick={(event) => onAddExistingNode(event, node)}
                      >
                        {node.content}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* No node input */}
          {currentNode.noChild.length === 0 && (
            <>
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
                {/* Existing Node toggle select */}
                <button
                  className="dropdown-button"
                  onClick={toggleExistingDropdownNo}
                >
                  <FontAwesomeIcon
                    icon={existingDropdownVisibleNo ? faAngleUp : faAngleDown}
                  />
                </button>
              </div>
              {/* Dropdown of existing nodes */}
              {existingDropdownVisibleNo && (
                <div style={styles.existingNodesDropdownContainer}>
                  {allNodes.map((node, index) => {
                    if (node.currentId === currentNode.currentId) {
                      return null;
                    }
                    return (
                      <div
                        style={styles.existingNodesDropdownItem}
                        className="white-bar-input-dropdown-additional existing-nodes-dropdown-item"
                        key={`dropdownItem${index}copy`}
                        data-node-id={currentNode.currentId}
                        data-node-type="no"
                        onClick={(event) => onAddExistingNode(event, node)}
                      >
                        {node.content}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default NodeEditor;
