import { useCallback, useEffect, useState } from "react";
import { Handle, Position, useNodesState, addEdge } from "@xyflow/react";
import "../../../../../CSS/Admin/TreeEditorNodeFlow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const handleStyle = { no: { left: 50 }, yes: { left: 175 } };

const edgeStyle = {
  no: { stroke: "red", strokeWidth: 2 },
  yes: { stroke: "green", strokeWidth: 2 },
};

const X_OFFSET = 50;

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
    ...restData
  },
  id,
  isConnectable,
  positionAbsoluteX,
  positionAbsoluteY,
  //   getNodeId,
  ...restProps
}) {
  const [currentNodeHeight, setCurrentNodeHeight] = useState(nodeHeight ?? 0);
  const [nodeColorClass, setNodeColorClass] = useState("tree-flow-root-color");
  const [textValue, setTextValue] = useState(content);

  useEffect(() => {
    switch (nodeType) {
      case "no":
        setNodeColorClass("tree-flow-no-color");
        break;
      case "yes":
        setNodeColorClass("tree-flow-yes-color");
        break;
      default:
        break;
    }
  }, [nodeHeight, currentNodeHeight, rootNode]);

  const onChange = useCallback(
    (evt) => {
      const newContent = evt.target.value;
      const nodeIdToUpdate = id;

      setTextValue(newContent);

      updateNodeContent(nodeIdToUpdate, newContent);
    },
    [updateNodeContent, id]
  );

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
        newNodeType === "no" ? "tree-flow-no-edge" : "tree-flow-yes-edge",
    };

    setEdges((eds) => eds.concat(newEdge));

    // if (updatedNodeHeight > maxTreeHeight) {
    //   console.log("new max");
    //   setMaxTreeHeight(updatedNodeHeight);
    //   setAllNodes((nds) => {
    //     nds.map((node, i) => {
    //       console.log(`updating node ${i}`, node);
    //       console.log(`${i} pos`, node.position);
    //       console.log(`${i} hg`, node.data.nodeHeight);
    //       console.log(`${i} hcomp`, updatedNodeHeight, node.data.nodeHeight);
    //       console.log(`${i} type`, node.data.nodeType);

    //       const offsetMultiplier =
    //         (updatedNodeHeight - node.data.nodeHeight) * 1;

    //       console.log(`${i} diff`, offsetMultiplier);

    //       const totalXOffset = X_OFFSET * offsetMultiplier;

    //       setSavedXOffset(totalXOffset);

    //       let newXPosition = node.position.x;

    //       switch (node.data.nodeType) {
    //         case "no":
    //           newXPosition = node.position.x - totalXOffset;
    //           break;
    //         case "yes":
    //           newXPosition = node.position.x + totalXOffset;
    //           break;
    //         default:
    //           break;
    //       }

    //       console.log(`nxp ${i}`, newXPosition);

    //       node.position.x = newXPosition;
    //       return node;
    //     });
    //     return nds;
    //   });
    // }

    // if (updatedNodeHeight > maxTreeHeight) {
    //   //console.log("new max");
    //   setMaxTreeHeight(updatedNodeHeight);
    //   setAllNodes((nds) => {
    //     //console.log("RESETTING");
    //     nds.map((node, i) => {
    //       //console.log("recalculating node", i, node.position.x);
    //       //console.log("ndata", i, node.data);

    //       console.log("Disc1", maxTreeHeight, node.data.nodeHeight);

    //       //console.log("Disc", maxTreeHeight - node.data.nodeHeight);

    //       if (node.position.x !== undefined) {
    //         //console.log("new node", i, node);
    //         node.position.x =
    //           node.position.x * (maxTreeHeight - node.data.nodeHeight);
    //       }

    //       return node;
    //     });
    //     return nds;
    //   });
    // }
  };

  const deleteFlowNode = () => {
    setAllNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const onAddNoNode = () => {
    console.log("no");

    addNewNode("no");
  };

  const onAddYesNode = () => {
    addNewNode("yes");
  };

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

  const noChildPresent = () => {
    if (findNodeById(id) === undefined) {
      return false;
    }
    return findNodeById(id).noChild.length > 0;
  };

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

  // Add a new node to the tree
  const onAddNode = (event) => {
    let newNode = generateNode();
    let targetNodeId = id;
    let addType = event.target.getAttribute("data-node-type");
    newNode.parentId = targetNodeId;
    newNode.yPos = positionAbsoluteY + 250;

    if (addType === "yes") {
      // Update data
      /**
       *         x:
          newNodeType === "no"
            ? positionAbsoluteX - (200 + savedXOffset)
            : positionAbsoluteX + (200 + savedXOffset),
        y: positionAbsoluteY + 250,
       */
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

  /**
   * Deletes a node from the tree.
   * @param {Event} event - The event object triggered by the click event.
   * @returns {void}
   */
  const onDeleteNode = (event) => {
    deleteFlowNode();
    deleteChild(id);
    console.log("delfl", flattenTree(rootNode));
  };

  function toTitleCase(str) {
    return str
      .toLowerCase() // Convert the entire string to lowercase first
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(" "); // Join the words back together
  }

  return (
    <div className={`tree-flow-question-node ${nodeColorClass}`}>
      {nodeType !== "root" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="tree-flow-handle"
        />
      )}

      <div>
        {/* Header */}
        <div className="tree-flow-header">
          <span className="tree-flow-question">
            {" "}
            {toTitleCase(nodeType)} Question:
          </span>

          {nodeType !== "root" && (
            <button className="tree-flow-delete" onClick={onDeleteNode}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          )}
        </div>

        {/* Text */}
        <div className="tree-flow-text">
          <textarea
            name="text"
            onChange={onChange}
            className="nodrag"
            id="text"
            rows="3"
            value={textValue}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="tree-flow-child-buttons">
          {noChildPresent() || (
            <button
              className="tree-flow-add-no-child"
              onClick={onAddNode}
              data-node-type="no"
            >
              No Node
            </button>
          )}

          {yesChildPresent() || (
            <button
              className="tree-flow-add-yes-child"
              onClick={onAddNode}
              data-node-type="yes"
            >
              Yes Node
            </button>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={handleStyle.no}
        isConnectable={!noChildPresent()}
        className="tree-flow-handle"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={handleStyle.yes}
        isConnectable={!yesChildPresent()}
        className="tree-flow-handle"
      />
    </div>
  );
}

export default QuestionInput;
