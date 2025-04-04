import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { use } from "react";

const handleStyle = { no: { left: 110 }, yes: { left: 130 } };

function QuestionInput({
  data: {
    getNodeId,
    setAllNodes,
    maxTreeHeight,
    setMaxTreeHeight,
    nodeHeight,
    nodeType,
    savedXOffset,
    setSavedXOffset,
    rootNode,
    generateNodeId,
    updateNodeContent,
    setRootNode,
    generateNode,
    setEdges,
    edges,
    flattenTree,
    content,
    selectedNode,
    setSelectedNode,
    forceNodesReRender,
    ...restData
  },
  id,
  isConnectable,
  positionAbsoluteX,
  positionAbsoluteY,
}) {
  const [currentNodeHeight] = useState(nodeHeight ?? 0);
  const [nodeColorClass, setNodeColorClass] = useState(
    "ut-tree-flow-root-color"
  );

  const manageNodeColor = () => {
    if (selectedNode?.currentId === id) {
      setNodeColorClass("ut-tree-flow-selected-color");
      return;
    }

    const thisNode = findNodeById(id);
    if (thisNode) {
      if (!thisNode.yesChild.length > 0 && !thisNode.noChild.length > 0) {
        setNodeColorClass("ut-tree-flow-leaf-color");
        return;
      }
    }

    if (nodeType === "yes") {
      setNodeColorClass("ut-tree-flow-yes-color");
    } else if (nodeType === "no") {
      setNodeColorClass("ut-tree-flow-no-color");
    } else if (nodeType === "root") {
      setNodeColorClass("ut-tree-flow-root-color");
    }
  };

  useEffect(() => {
    manageNodeColor();
  }, [nodeHeight, currentNodeHeight, rootNode]);

  /**
   * Adds a new node to the tree.
   *
   * @param {string} newNodeType - The type of the new node, either "yes" or "no".
   */
  const addNewNode = (newNodeType) => {
    const updatedNodeHeight = currentNodeHeight + 1;

    const newNode = {
      id: generateNodeId(),
      data: {
        getNodeId,
        setAllNodes,
        maxTreeHeight,
        setMaxTreeHeight,
        savedXOffset,
        setSavedXOffset,
        rootNode,
        generateNodeId,
        updateNodeContent,
        setRootNode,
        generateNode,
        nodeHeight: updatedNodeHeight,
        nodeType: newNodeType === "no" ? "no" : "yes",
        ...restData,
      },
      type: "questionInput",
      position: {
        x:
          newNodeType === "no"
            ? positionAbsoluteX - (200 + savedXOffset)
            : positionAbsoluteX + (200 + savedXOffset),
        y: positionAbsoluteY + 250,
      },
    };

    setAllNodes((nds) => nds.concat(newNode));

    const newEdge = {
      id: `edge_${id}_${newNode.id}`,
      source: id,
      target: newNode.id,
      sourceHandle: newNodeType,
      className:
        newNodeType === "no" ? "ut-tree-flow-no-edge" : "ut-tree-flow-yes-edge",
    };

    setEdges((eds) => eds.concat(newEdge));
  };

  /**
   * Deletes the current node from the tree by filtering it out of the
   * `allNodes` state.
   */
  const deleteFlowNode = () => {
    setAllNodes((nds) => nds.filter((node) => node.id !== id));
  };

  /**
   * Adds a new "no" node to the tree by calling `addNewNode` with the
   * argument `"no"`.
   */
  const onAddNoNode = () => {
    addNewNode("no");
  };

  /**
   * Adds a new "yes" node to the tree by calling `addNewNode` with the
   * argument `"yes"`.
   */
  const onAddYesNode = () => {
    addNewNode("yes");
  };

  /**
   * Finds a node in a decision tree by its ID.
   * @param {Object} rootNode - The root node of the decision tree.
   * @param {string} targetNodeId - The ID of the node to find.
   * @returns {Object|undefined} - Returns the node object if found, otherwise returns undefined.
   */
  const findNodeById = (targetNodeId) => {
    const _findNodeById = (node) => {
      if (node === undefined) {
        return undefined;
      }
      if (node.currentId === targetNodeId) {
        return node;
      }
      const noResult = _findNodeById(node.noChild[0]);
      const yesResult = _findNodeById(node.yesChild[0]);

      return noResult || yesResult;
    };

    return _findNodeById(rootNode);
  };

  /**
   * Checks if the node with the given id has any children in its noChild array.
   * @return {boolean} - True if the node has any children in its noChild array.
   */
  const noChildPresent = () => {
    if (findNodeById(id) === undefined) {
      return false;
    }
    return findNodeById(id).noChild.length > 0;
  };

  /**
   * Checks if the node with the given id has any children in its yesChild array.
   * @return {boolean} - True if the node has any children in its yesChild array.
   */
  const yesChildPresent = () => {
    if (findNodeById(id) === undefined) {
      return false;
    }
    return findNodeById(id).yesChild.length > 0;
  };

  /**
   * Adds a new node to the yesChild array of a target node within the decision tree.
   * @param {string} targetNodeId - The ID of the target node to add the new node to.
   * @param {Object} nodeToInsert - The new node to insert.
   */
  const addYesChild = (targetNodeId, nodeToInsert) => {
    const addYesChildToTarget = (node) => {
      if (node.currentId === targetNodeId) {
        // Match found, create a new node with updated yesChild array
        return {
          ...node,
          yesChild: node.yesChild.concat(nodeToInsert),
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

  /**
   * Adds a new node to the noChild array of a target node within the decision tree.
   * @param {string} targetNodeId - The ID of the target node to add the new node to.
   * @param {Object} nodeToInsert - The new node to insert.
   */
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

  /**
   * Handles the addition of a new node to the decision tree.
   * @param {Event} event - The event that triggered the addition of the node.
   * Updates the tree data structure and triggers a re-render.
   */
  const onAddNode = (event) => {
    let newNode = generateNode();
    let targetNodeId = id;
    let addType = event.target.getAttribute("data-node-type");
    newNode.parentId = targetNodeId;
    newNode.yPos = positionAbsoluteY + 250;

    if (addType === "yes") {
      newNode.xPos = positionAbsoluteX + (200 + savedXOffset);
      addYesChild(targetNodeId, newNode);
      // Update UI
      onAddYesNode();
    } else {
      // Update data
      newNode.xPos = positionAbsoluteX - (200 + savedXOffset);
      addNoChild(targetNodeId, newNode);
      // Update UI
      onAddNoNode();
    }
  };

  /**
   * Deletes a node from the decision tree by its ID.
   * @param {string} nodeIdToDelete - The ID of the node to delete.
   * @returns {undefined} - Does not return anything, instead updates the tree data structure and triggers a re-render.
   */
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

  /**
   * Deletes a node from the tree.
   * @param {Event} event - The event object triggered by the click event.
   * @returns {void}
   */
  const onDeleteNode = (event) => {
    deleteFlowNode();
    deleteChild(id);
  };

  /**
   * Converts a string to title case.
   *
   * @param {string} str - The input string
   * @return {string} The string converted to title case
   */
  function toTitleCase(str) {
    return str
      .toLowerCase() // Convert the entire string to lowercase first
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(" "); // Join the words back together
  }

  const checkIsSelected = () => {
    if (selectedNode.currentId === id) {
      return true;
    }
    return false;
  };

  const onNodeClick = (event) => {
    let clickedNode = findNodeById(id);
    let clickedContent = clickedNode.content;

    setSelectedNode(clickedNode);
  };

  // log selected node
  useEffect(() => {
    if (selectedNode === undefined) return;
    // manageNodeColor();
    if (selectedNode.currentId === id) {
    }
    // forceNodesReRender();
  }, [selectedNode]);

  return (
    <div
      className={`nodrag ut-tree-flow-question-node ${nodeColorClass}`}
      onClick={onNodeClick}
    >
      {nodeType !== "root" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="ut-tree-flow-handle ut-hidden"
        />
      )}

      <div className="ut-tree-flow-node-content"></div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={handleStyle.no}
        isConnectable={false}
        className={`ut-tree-flow-handle ${
          findNodeById(id)?.noChild?.length > 0 ? "ut-hidden" : "ut-hidden"
        }`}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={handleStyle.yes}
        isConnectable={false}
        className={`ut-tree-flow-handle ${
          findNodeById(id)?.yesChild?.length > 0 ? "ut-hidden" : "ut-hidden"
        }`}
      />
    </div>
  );
}

export default QuestionInput;
