import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

// import "../../../../CSS/Admin/TreeEditorNodeFlow.css";
import "../../../../CSS/UserTreeV2.css";

// Custom components
import QuestionInput from "./FlowComponents/QuestionInput";
// import DetailedEdge from "./FlowComponents/DetailedEdge";
import HeightControls from "./FlowComponents/HeightControls";
import LengthControls from "./FlowComponents/LengthControls";
import AngleControls from "./FlowComponents/AngleControls";

// Testing
import DetailedEdge from "../../../../UserTreeV2/FlowComponents/DetailedEdge";

const NodeFlow = ({
  rootNode,
  setRootNode,
  existingMidOffsets,
  setExistingMidOffsets,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        backgroundColor: "white",
        border: "1px solid black",
      }}
    >
      <ReactFlowProvider>
        <NodeFlowInstance
          rootNode={rootNode}
          setRootNode={setRootNode}
          existingMidOffsets={existingMidOffsets}
          setExistingMidOffsets={setExistingMidOffsets}
        />
      </ReactFlowProvider>
    </div>
  );
};

const nodeTypes = { questionInput: QuestionInput };

const getNodeId = () => `randomnode_${+new Date()}`;

const flowKey = "example-flow";

const DEFAULT_NEW_NODE_HEIGHT = 350;

const DEFAULT_NEW_NODE_X_OFFSET = 200;

/**
 * Finds a node in a decision tree by its ID.
 * @param {Object} rootNode - The root node of the decision tree.
 * @param {string} targetNodeId - The ID of the node to find.
 * @returns {Object|undefined} - Returns the node object if found, otherwise returns undefined.
 */
const findTreeNodeById = (rootNode, targetNodeId) => {
  const _findTreeNodeById = (node) => {
    if (node === undefined) {
      return undefined;
    }
    if (node.currentId === targetNodeId) {
      return node;
    }
    const noResult = _findTreeNodeById(node.noChild[0]);
    const yesResult = _findTreeNodeById(node.yesChild[0]);

    return noResult || yesResult;
  };

  return _findTreeNodeById(rootNode);
};

/**
 * A React component that renders a React Flow graph and handles the loading and
 * saving of the graph data to/from local storage. The component also provides
 * functions to add nodes and edges to the graph and to update the content of an
 * existing node.
 *
 * @param {Object} rootNode - The root node of the decision tree.
 * @param {Function} setRootNode - A function to update the root node of the decision tree.
 * @returns {JSX.Element} - A JSX element representing the React Flow graph.
 */
const NodeFlowInstance = ({
  rootNode,
  setRootNode,
  existingMidOffsets,
  setExistingMidOffsets,
}) => {
  // Primary visual state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // Track data state
  const [dataLoaded, setDataLoaded] = useState(false);
  // Node ID state
  const [idCounter, setIdCounter] = useState(0);
  // Selected Node state
  const [selectedNode, setSelectedNode] = useState(
    findTreeNodeById(rootNode, "node0")
  );
  // Force re render
  const [canvasKey, setCanvasKey] = useState(0);

  // Re render component
  const forceReRender = () => {
    setCanvasKey((prevKey) => prevKey + 1); // Change the key to trigger re-render
  };

  // Additional misc data
  const [maxTreeHeight, setMaxTreeHeight] = useState(0);
  const [savedXOffset, setSavedXOffset] = useState(0);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  // Load existing nodes once on page load
  useEffect(() => {
    setNodes([]);
    // Check for max node id in existing tree
    setIdCounter(loadExistingTree());
    setDataLoaded(true);
  }, []);

  // Maps the data changes to the visual components
  useEffect(() => {
    if (dataLoaded) {
      setNodes((nds) => {
        const filtered = nds.filter((flowNode) => {
          const keepIds = flattenTree(rootNode).map((node) => node.currentId);
          return keepIds.includes(flowNode.id);
        });
        return filtered;
      });

      const filtered = loadedNodes.filter((flowNode) => {
        const keepIds = flattenTree(rootNode).map((node) => node.currentId);
        return keepIds.includes(flowNode.id);
      });

      setNodes(filtered);
    }
  }, [rootNode, dataLoaded]);

  /**
   * Finds an edge based on the current node's ID (target) and the parent node's ID (source).
   * @param {Array} edges - The array of edge objects.
   * @param {string} currentNodeId - The ID of the current node (target).
   * @param {string} parentNodeId - The ID of the parent node (source).
   * @returns {Object | null} - Returns the matching edge object or null if not found.
   */
  function findEdgeByNodes(edges, currentNodeId, parentNodeId) {
    return (
      edges.find(
        (edge) => edge.source === parentNodeId && edge.target === currentNodeId
      ) || null
    );
  }

  // Function to trigger re-render of all nodes
  const forceNodesReRender = () => {
    setRootNode((prevRootNode) => ({
      ...prevRootNode,
      data: {
        ...prevRootNode?.data,
        _forceUpdate: Math.random(), // Harmless, random change
      },
    }));
  };

  // Act on changes to the selected node
  useEffect(() => {
    if (selectedNode) {
      forceReRender();
      forceNodesReRender();
    }
  }, [selectedNode]);

  const findMidOffset = (edgeId) => {
    const match = existingMidOffsets?.find((e) => e.edgeId === edgeId);
    return match?.midOffset || { x: 0, y: 0 };
  };

  /**
   * Recursively loads the existing tree structure into the nodes and edges
   * state variables.
   * @param {Object} node - The current node being processed.
   * @param {"root"|"yes"|"no"} type - The type of the current node.
   * @returns {undefined} - Does not return a value.
   * @private
   */
  const loadExistingTree = () => {
    const _loadExistingTree = (node, type, maxCounter) => {
      if (node === undefined) {
        return maxCounter;
      }

      let currentNodeCounter = parseInt(node.currentId.match(/\d+/)[0]);

      if (currentNodeCounter + 1 > maxCounter) {
        maxCounter = currentNodeCounter + 1;
      }

      let formattedNode = {
        id: node.currentId,
        type: "questionInput",
        position: { x: node.xPos, y: node.yPos },
        data: {
          getNodeId: getNodeId,
          nodeHeight: 0,
          nodeType: type,
          content: node.content,
        },
      };

      if (node.yesChild[0]) {
        let edgeIdYes = `edge_${node.currentId}_${node.yesChild[0].currentId}`;
        let formattedEdge = {
          id: edgeIdYes,
          source: node.currentId,
          target: node.yesChild[0].currentId,
          sourceHandle: "yes",
          className: "ut-tree-flow-yes-edge",
          type: "detailed",
          data: {
            sourceHandle: "yes",
            admin: true,
            midOffset: findMidOffset(edgeIdYes),
            setExistingMidOffsets: setExistingMidOffsets,
          },
          selectable: false,
        };
        setEdges((eds) => eds.concat(formattedEdge));
      }

      if (node.noChild[0]) {
        let edgeIdNo = `edge_${node.currentId}_${node.noChild[0].currentId}`;
        let formattedEdge = {
          id: edgeIdNo,
          source: node.currentId,
          target: node.noChild[0].currentId,
          sourceHandle: "no",
          className: "ut-tree-flow-no-edge",
          type: "detailed",
          data: {
            sourceHandle: "no",
            admin: true,
            midOffset: findMidOffset(edgeIdNo),
            setExistingMidOffsets: setExistingMidOffsets,
          },
          selectable: false,
        };
        setEdges((eds) => eds.concat(formattedEdge));
      }

      setNodes((nds) => nds.concat(formattedNode));

      let noMax = _loadExistingTree(node.noChild[0], "no", maxCounter);
      let yesMax = _loadExistingTree(node.yesChild[0], "yes", maxCounter);

      return Math.max(noMax, yesMax);
    };

    let loadedCounter = _loadExistingTree(rootNode, "root", 0);
    return loadedCounter;
  };

  const extractMidOffsets = (edges) => {
    return edges
      .filter((edge) => edge.data?.midOffset)
      .map((edge) => ({
        edgeId: edge.id,
        midOffset: edge.data.midOffset,
      }));
  };

  // Update existing mid offsets once loaded
  useEffect(() => {
    console.log("EDGES FOR PARSING", edges);
    console.log("EXTRACTED MID OFFSETS", extractMidOffsets(edges));
    console.log("EXISTING MID OFFSETS", existingMidOffsets);

    if (typeof existingMidOffsets === "undefined") return;

    setExistingMidOffsets(extractMidOffsets(edges));
  }, [edges]);

  // Log changes to mig offsets
  useEffect(() => {
    console.log("EXISTING MID OFFSETS", existingMidOffsets);
  }, [existingMidOffsets]);

  /**
   * Recursively flattens a tree structure into an array of nodes. The array
   * will contain all nodes in the tree, in the order they were traversed (i.e.,
   * pre-order traversal). This is useful for converting a tree structure into a
   * flat array for things like rendering a list of all nodes in a tree.
   *
   * @param {Object} tree - The tree to flatten.
   * @returns {Array} - An array of all nodes in the tree, in the order they were
   *   traversed.
   */
  function flattenTree(tree) {
    const result = [];

    function traverse(node) {
      if (!node) return;

      // Add the current node to the result array
      result.push(node);

      // Recursively traverse the child nodes (assuming the children are in an array)
      if (node.yesChild) {
        node.yesChild.forEach(traverse);
      }
      if (node.noChild) {
        node.noChild.forEach(traverse);
      }
    }

    traverse(tree);
    return result;
  }

  /**
   * Generates a new unique node ID based on the current counter value.
   * @returns {string} - The generated node ID.
   */
  const generateNodeId = () => {
    setIdCounter((prevVal) => prevVal + 1);
    return `node${idCounter + 1}`;
  };

  /**
   * Generates a new node with the provided content and a unique ID.
   * @param {string} content - The content of the new node.
   * @returns {Object} - The newly generated node.
   */
  function generateNode(content) {
    const newId = generateNodeId();
    const newNode = {
      currentId: newId,
      content: content,
      parentId: null,
      noChild: [],
      yesChild: [],
      xPos: 0,
      yPos: 0,
    };
    return newNode;
  }

  /**
   * Updates the content of a specific node within the decision tree.
   * @param {string} nodeIdToUpdate - The ID of the node to update.
   * @param {string} newContent - The new content for the node.
   */
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

  // Multi select controls
  const [multiSelectOn, setMultiSelectOn] = useState(false);
  const [multiSelectList, setMultiSelectList] = useState([]);

  // Logging
  useEffect(() => {}, [rootNode]);

  const toggleMultiSelect = () => {
    setMultiSelectOn((prevState) => {
      if (!multiSelectOn) {
        setSelectedNode(null);
      } else {
        setSelectedNode(findTreeNodeById(rootNode, "node0"));
        setMultiSelectList([]);
      }

      return !prevState;
    });

    forceReRender();
    forceNodesReRender();
  };

  // Pass down node data for use in initial + other nodes
  const loadedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      allNodes: nodes,
      setAllNodes: setNodes,
      maxTreeHeight,
      setMaxTreeHeight,
      savedXOffset,
      setSavedXOffset,
      rootNode,
      generateNode,
      generateNodeId,
      updateNodeContent,
      setRootNode,
      setEdges,
      edges,
      flattenTree,
      selectedNode,
      setSelectedNode,
      forceReRender,
      forceNodesReRender,
      multiSelectOn,
      setMultiSelectOn,
      multiSelectList,
      setMultiSelectList,
    },
  }));

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
    setSelectedNode(findTreeNodeById(newRootNode, selectedNode.currentId));
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
    setSelectedNode(findTreeNodeById(updatedRootNode, selectedNode.currentId));
  };

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        let edgeId = `edge_${params.source}_${params.target}`;
        const newEdge = {
          id: edgeId,
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          className:
            params.sourceHandle === "no"
              ? "ut-tree-flow-no-edge"
              : "ut-tree-flow-yes-edge",
          type: "detailed",
          data: {
            sourceHandle: params.sourceHandle,
            admin: true,
            midOffset: findMidOffset(edgeId),
            setExistingMidOffsets: setExistingMidOffsets,
          },
          selectable: false,
        };

        if (params.sourceHandle === "no") {
          addNoChild(params.source, findTreeNodeById(rootNode, params.target));
        } else {
          addYesChild(params.source, findTreeNodeById(rootNode, params.target));
        }

        return eds.concat(newEdge);
      }),
    [setEdges, rootNode]
  );

  /**
   *
   * Panel Controls
   *
   */

  /**
   * Deletes the current node from the tree by filtering it out of the
   * `allNodes` state.
   */
  const deleteFlowNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.currentId));
  };

  /**
   * Deletes a node from the decision tree by its ID.
   * @param {string} nodeIdToDelete - The ID of the node to delete.
   * @returns {undefined} - Does not return anything, instead updates the tree data structure and triggers a re-render.
   */
  const deleteChild = () => {
    const deleteNodeRecursively = (node) => {
      if (node.currentId === selectedNode.currentId) {
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
    deleteChild();
    setSelectedNode(null);
  };

  /**
   * Adds a new node to the tree.
   *
   * @param {string} newNodeType - The type of the new node, either "yes" or "no".
   */
  const addNewNode = (newNodeType) => {
    const newNode = {
      id: generateNodeId(),
      data: {
        getNodeId,
        setAllNodes: setNodes,
        savedXOffset,
        setSavedXOffset,
        rootNode,
        generateNodeId,
        updateNodeContent,
        setRootNode,
        generateNode,
        nodeType: newNodeType === "no" ? "no" : "yes",
      },
      type: "questionInput",
      position: {
        x:
          newNodeType === "no"
            ? selectedNode.xPos - (DEFAULT_NEW_NODE_X_OFFSET + savedXOffset)
            : selectedNode.xPos + (DEFAULT_NEW_NODE_X_OFFSET + savedXOffset),
        y: selectedNode.yPos + DEFAULT_NEW_NODE_HEIGHT,
      },
    };

    setNodes((nds) => nds.concat(newNode));

    let edgeId = `edge_${selectedNode.currentId}_${newNode.id}`;

    const newEdge = {
      id: edgeId,
      source: selectedNode.currentId,
      target: newNode.id,
      sourceHandle: newNodeType,
      className:
        newNodeType === "no" ? "ut-tree-flow-no-edge" : "ut-tree-flow-yes-edge",
      type: "detailed",
      data: {
        sourceHandle: newNodeType,
        admin: true,
        midOffset: findMidOffset(edgeId),
        setExistingMidOffsets: setExistingMidOffsets,
      },
      selectable: false,
    };

    setEdges((eds) => eds.concat(newEdge));
  };

  /**
   * Adds a new "yes" node to the tree by calling `addNewNode` with the
   * argument `"yes"`.
   */
  const onAddYesNode = () => {
    addNewNode("yes");
  };

  /**
   * Adds a new "no" node to the tree by calling `addNewNode` with the
   * argument `"no"`.
   */
  const onAddNoNode = () => {
    addNewNode("no");
  };

  /**
   * Handles the addition of a new node to the decision tree.
   * @param {Event} event - The event that triggered the addition of the node.
   * Updates the tree data structure and triggers a re-render.
   */
  const onAddNode = (nodeType) => {
    let newNode = generateNode();
    let targetNodeId = selectedNode.currentId;
    let addType = nodeType;
    newNode.parentId = targetNodeId;
    newNode.yPos = selectedNode.yPos + DEFAULT_NEW_NODE_HEIGHT;

    if (addType === "yes") {
      newNode.xPos =
        selectedNode.xPos + (DEFAULT_NEW_NODE_X_OFFSET + savedXOffset);
      addYesChild(targetNodeId, newNode);
      // Update UI
      onAddYesNode();
    } else {
      // Update data
      newNode.xPos =
        selectedNode.xPos - (DEFAULT_NEW_NODE_X_OFFSET + savedXOffset);
      addNoChild(targetNodeId, newNode);
      // Update UI
      onAddNoNode();
    }
  };

  const addYesChildToSelectedNode = () => {
    onAddNode("yes");
  };

  const AddNoChildToSelectedNode = () => {
    onAddNode("no");
  };

  /**
   *
   * Height modifiers
   *
   */

  // Lock the y coordinate of the node
  const [initialY, setInitialY] = useState(null);
  const [lockedY, setLockedY] = useState(false);

  // Capture the initial Y position when dragging starts
  const handleNodeDragStart = (event, node) => {
    setInitialY(node.position.y);
  };

  // Lock the Y position to the initial value if toggled
  const handleNodeDrag = (event, node) => {
    if (lockedY) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, position: { x: node.position.x, y: initialY } }
            : n
        )
      );
    } else {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, position: { x: node.position.x, y: node.position.y } }
            : n
        )
      );
    }
  };

  /**
   * Updates the position of a node in the decision tree.
   * @param {string} nodeIdToUpdate - The ID of the node to update.
   * @param {Object} newPos - The new position of the node with x and y coordinates.
   */
  const updateNodePosition = (nodeIdToUpdate, newPos) => {
    const updatePositionRecursively = (node) => {
      if (node.currentId === nodeIdToUpdate) {
        if (lockedY) {
          newPos.y = initialY;
        }
        return { ...node, xPos: newPos.x, yPos: newPos.y };
      }

      // Recursively process both noChild and yesChild arrays
      const updatedNoChild = node.noChild.map(updatePositionRecursively);
      const updatedYesChild = node.yesChild.map(updatePositionRecursively);

      return {
        ...node,
        noChild: updatedNoChild,
        yesChild: updatedYesChild,
      };
    };

    setRootNode((prevRootNode) => updatePositionRecursively(prevRootNode));
  };

  /**
   * Handles the event when a node drag is stopped. Updates the
   * position of the node in the decision tree.
   * @param {Object} event - The event object from the ReactFlow library.
   * @param {Object} node - The node object that was dragged.
   */
  const handleNodeDragStop = (event, node) => {
    updateNodePosition(node.id, node.position);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={{ detailed: DetailedEdge }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      fitView
      fitViewOptions={{ padding: 2 }}
      nodeTypes={nodeTypes}
      minZoom={0.081} // Set the minimum zoom level (zoom out)
      deleteKeyCode={"Disabled"}
      onNodeDragStop={handleNodeDragStop}
      onNodeDragStart={handleNodeDragStart}
      onNodeDrag={handleNodeDrag}
    >
      <Panel position="top-right">
        <div
          style={{
            backgroundColor: "lightgrey", // Light grey background
            border: "1px solid black", // Black border
            padding: "10px", // Padding for inner spacing
            borderRadius: "8px", // Optional: Rounded corners
          }}
        >
          <button
            className="tree-flow-panel-btn"
            onClick={AddNoChildToSelectedNode}
            disabled={selectedNode && selectedNode.noChild.length !== 0}
          >
            Add No
          </button>
          <button
            className="tree-flow-panel-btn"
            onClick={addYesChildToSelectedNode}
            disabled={selectedNode && selectedNode.yesChild.length !== 0}
          >
            Add Yes
          </button>
          <button
            className="tree-flow-panel-btn"
            onClick={onDeleteNode}
            disabled={selectedNode && selectedNode.currentId === "node0"}
          >
            Delete
          </button>
          {/* Arrow Height Controls */}
          <HeightControls
            initialY={initialY}
            setInitialY={setInitialY}
            lockedY={lockedY}
            setLockedY={setLockedY}
            selectedNode={selectedNode}
            findTreeNodeById={findTreeNodeById}
            rootNode={rootNode}
            setRootNode={setRootNode}
            nodes={nodes}
            setNodes={setNodes}
            multiSelectOn={multiSelectOn}
            multiSelectList={multiSelectList}
          ></HeightControls>

          {/* Arrow Length Controls */}
          <LengthControls
            selectedNode={selectedNode}
            rootNode={rootNode}
            findTreeNodeById={findTreeNodeById}
            setRootNode={setRootNode}
            setNodes={setNodes}
            multiSelectOn={multiSelectOn}
            multiSelectList={multiSelectList}
          ></LengthControls>

          {/* Arrow Angle Controls */}
          <AngleControls
            selectedNode={selectedNode}
            rootNode={rootNode}
            findTreeNodeById={findTreeNodeById}
            setRootNode={setRootNode}
            setNodes={setNodes}
            multiSelectOn={multiSelectOn}
            multiSelectList={multiSelectList}
          ></AngleControls>

          {/* Toggle multi select */}
          <button
            className={
              multiSelectOn
                ? "tree-flow-panel-btn-locked"
                : "tree-flow-panel-btn"
            }
            onClick={toggleMultiSelect}
          >
            Multi Select
          </button>
        </div>
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};

export default NodeFlow;
