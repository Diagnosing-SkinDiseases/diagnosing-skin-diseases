import { useCallback, useEffect, useState, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import "../../../../../CSS/Admin/TreeEditorNodeFlow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

/*
 * ============================================================
 * ADMIN CONNECTION HANDLE CONFIGURATION
 * ============================================================
 *
 * Handles are editing controls.
 *
 * Their visible positions are independent of the
 * center-based arrow rendering geometry.
 *
 * Outbound handles:
 * - Available only if the corresponding connection
 *   does not already exist.
 *
 * Inbound handles:
 * - Always available on non-root nodes.
 * - Multiple inbound connections are supported.
 *
 * Unavailable handles:
 * - Hidden
 * - Not connectable
 * - Not interactive
 *
 * All handles remain mounted so React Flow can
 * continue resolving existing connections.
 * ============================================================
 */

const HANDLE_SIZE = "0.75em";

const handleStyle = {
  target: {
    top: 0,
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: "50%",
    backgroundColor: "black",
  },

  no: {
    left: 110,
    top: "auto",
    bottom: 0,
    right: "auto",
    transform: "translate(-50%, 50%)",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: "50%",
    backgroundColor: "black",
  },

  yes: {
    left: 130,
    top: "auto",
    bottom: 0,
    right: "auto",
    transform: "translate(-50%, 50%)",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: "50%",
    backgroundColor: "black",
  },
};

/*
 * Returns the appearance and interaction settings
 * for an available or unavailable handle.
 *
 * Inline styles override the previous CSS
 * hover-opacity rules.
 */
const getHandleStyle = (type, available) => ({
  ...handleStyle[type],

  opacity: available ? 1 : 0,

  visibility: available ? "visible" : "hidden",

  pointerEvents: available ? "all" : "none",

  cursor: available ? "crosshair" : "default",

  transition: "none",
});

/*
 * ============================================================
 * QUESTION INPUT COMPONENT
 * ============================================================
 */

function QuestionInput({
  data: {
    getNodeId,
    setAllNodes,
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
    setSelectedNode,
    selectedNode,
    forceReRender,
    forceNodesReRender,
    multiSelectOn,
    setMultiSelectOn,
    multiSelectList,
    setMultiSelectList,
    ...restData
  },
  id,
  isConnectable,
  positionAbsoluteX,
  positionAbsoluteY,
}) {
  const [currentNodeHeight, setCurrentNodeHeight] = useState(nodeHeight ?? 0);

  const [nodeColorClass, setNodeColorClass] = useState("tree-flow-root-color");

  const [textValue, setTextValue] = useState(content);

  const nodeRef = useRef(null);

  /*
   * ============================================================
   * NODE COLOR
   * ============================================================
   */

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

  /*
   * ============================================================
   * TEXT EDITING
   * ============================================================
   */

  const onChange = useCallback(
    (evt) => {
      const newContent = evt.target.value;
      const nodeIdToUpdate = id;

      setTextValue(newContent);

      updateNodeContent(nodeIdToUpdate, newContent);
    },
    [updateNodeContent, id],
  );

  /*
   * ============================================================
   * NEW FLOW NODE CREATION
   * ============================================================
   */

  const addNewNode = (newNodeType) => {
    const updatedNodeHeight = currentNodeHeight + 1;

    const newNode = {
      id: generateNodeId(),

      data: {
        getNodeId,
        setAllNodes,
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

      type: "detailed",
    };

    setEdges((eds) => eds.concat(newEdge));
  };

  /*
   * ============================================================
   * DELETE FLOW NODE
   * ============================================================
   */

  const deleteFlowNode = () => {
    setAllNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const onAddNoNode = () => {
    addNewNode("no");
  };

  const onAddYesNode = () => {
    addNewNode("yes");
  };

  /*
   * ============================================================
   * TREE LOOKUP
   * ============================================================
   */

  const findNodeById = (targetNodeId) => {
    const _findNodeById = (node) => {
      if (node === undefined || node === null) {
        return undefined;
      }

      if (node.currentId === targetNodeId) {
        return node;
      }

      const noResult = _findNodeById(node.noChild?.[0]);

      const yesResult = _findNodeById(node.yesChild?.[0]);

      return noResult || yesResult;
    };

    return _findNodeById(rootNode);
  };

  /*
   * ============================================================
   * EXISTING CHILD CHECKS
   * ============================================================
   */

  const noChildPresent = () => {
    const node = findNodeById(id);

    if (node === undefined) {
      return false;
    }

    return node.noChild.length > 0;
  };

  const yesChildPresent = () => {
    const node = findNodeById(id);

    if (node === undefined) {
      return false;
    }

    return node.yesChild.length > 0;
  };

  /*
   * ============================================================
   * CONNECTION HANDLE AVAILABILITY
   * ============================================================
   *
   * Outbound handles are available only when
   * the corresponding Yes/No connection
   * does not already exist.
   *
   * Inbound handles are always available
   * on non-root nodes, allowing more than
   * one incoming connection.
   */

  const hasNoEdge =
    edges?.some((edge) => edge.source === id && edge.sourceHandle === "no") ??
    false;

  const hasYesEdge =
    edges?.some((edge) => edge.source === id && edge.sourceHandle === "yes") ??
    false;

  /*
   * INBOUND HANDLE
   *
   * IMPORTANT:
   *
   * Do not check parentId or existing
   * inbound edges.
   *
   * A node may receive multiple arrows
   * from different source nodes.
   *
   * Root nodes do not expose an inbound
   * connection handle.
   */
  const inboundAvailable = nodeType !== "root" && isConnectable !== false;

  /*
   * OUTBOUND HANDLES
   *
   * Each node may have at most one No
   * connection and one Yes connection.
   */
  const noAvailable =
    !noChildPresent() && !hasNoEdge && isConnectable !== false;

  const yesAvailable =
    !yesChildPresent() && !hasYesEdge && isConnectable !== false;

  /*
   * ============================================================
   * TREE RELATIONSHIP UPDATES
   * ============================================================
   */

  const addYesChild = (targetNodeId, nodeToInsert) => {
    const addYesChildToTarget = (node) => {
      if (node.currentId === targetNodeId) {
        return {
          ...node,
          yesChild: node.yesChild.concat(nodeToInsert),
        };
      } else if (node.noChild.length || node.yesChild.length) {
        return {
          ...node,

          noChild: node.noChild.map(addYesChildToTarget),

          yesChild: node.yesChild.map(addYesChildToTarget),
        };
      }

      return node;
    };

    let newRootNode = addYesChildToTarget(rootNode);

    setRootNode(newRootNode);
  };

  const addNoChild = (targetNodeId, nodeToInsert) => {
    const addNoChildToTarget = (node) => {
      if (node.currentId === targetNodeId) {
        return {
          ...node,
          noChild: [...node.noChild, nodeToInsert],
        };
      }

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

  /*
   * ============================================================
   * ADD NODE TO TREE
   * ============================================================
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

      onAddYesNode();
    } else {
      newNode.xPos = positionAbsoluteX - (200 + savedXOffset);

      addNoChild(targetNodeId, newNode);

      onAddNoNode();
    }
  };

  /*
   * ============================================================
   * DELETE TREE NODE
   * ============================================================
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

  const onDeleteNode = (event) => {
    deleteFlowNode();
    deleteChild(id);
  };

  /*
   * ============================================================
   * TITLE CASE
   * ============================================================
   */

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /*
   * ============================================================
   * NODE SELECTION
   * ============================================================
   */

  const clickSelectNode = () => {
    if (!multiSelectOn) {
      setSelectedNode(findNodeById(id));
    } else {
      setMultiSelectList((prevState) => {
        const node = findNodeById(id);

        const nodeExists = prevState.some(
          (n) => n.currentId === node.currentId,
        );

        if (nodeExists) {
          return prevState.filter((n) => n.currentId !== node.currentId);
        } else {
          return [...prevState, node];
        }
      });
    }

    forceNodesReRender();
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      ref={nodeRef}
      className={`tree-flow-question-node ${
        (selectedNode && selectedNode.currentId === id) ||
        (multiSelectOn && multiSelectList.some((node) => node.currentId === id))
          ? "tree-flow-selected-color"
          : nodeColorClass
      }`}
      onClick={clickSelectNode}
    >
      {/*
       * INBOUND HANDLE
       *
       * Original top-center position.
       *
       * Always visible and connectable for
       * non-root nodes, regardless of the
       * number of incoming connections.
       */}
      {nodeType !== "root" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={inboundAvailable}
          className="tree-flow-handle"
          style={getHandleStyle("target", inboundAvailable)}
        />
      )}

      <div className="tree-flow-node-content">
        {/* Header */}
        <div className="tree-flow-header">
          <span className="tree-flow-question">
            {" "}
            {toTitleCase(nodeType)} Question:
          </span>

          {/* Existing delete button remains disabled.
          {nodeType !== "root" && (
            <button
              className="tree-flow-delete"
              onClick={onDeleteNode}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          )}
          */}
        </div>

        {/* Text editor */}
        <div className="tree-flow-text">
          <textarea
            name="text"
            onChange={onChange}
            className="nodrag tree-flow-textarea nowheel"
            id="text"
            rows="3"
            value={textValue}
          ></textarea>
        </div>

        {/* Existing child buttons remain disabled.
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
        */}
      </div>

      {/*
       * OUTBOUND NO HANDLE
       *
       * Original bottom position.
       *
       * Available only when the node has
       * no existing No child or No edge.
       */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        isConnectable={noAvailable}
        className="tree-flow-handle"
        style={getHandleStyle("no", noAvailable)}
      />

      {/*
       * OUTBOUND YES HANDLE
       *
       * Original bottom position.
       *
       * Available only when the node has
       * no existing Yes child or Yes edge.
       */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        isConnectable={yesAvailable}
        className="tree-flow-handle"
        style={getHandleStyle("yes", yesAvailable)}
      />
    </div>
  );
}

export default QuestionInput;
