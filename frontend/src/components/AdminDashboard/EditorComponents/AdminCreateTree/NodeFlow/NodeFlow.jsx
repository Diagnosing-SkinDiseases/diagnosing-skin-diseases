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

import "../../../../CSS/Admin/TreeEditorNodeFlow.css";

import QuestionInput from "./FlowComponents/QuestionInput";
import DetailedEdge from "./FlowComponents/DetailedEdge";

const nodeTypes = { questionInput: QuestionInput };

const getNodeId = () => `randomnode_${+new Date()}`;

const flowKey = "example-flow";

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
const NodeFlowInstance = ({ rootNode, setRootNode }) => {
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

  // Function to trigger re-render of all nodes
  const forceNodesReRender = () => {
    console.log("ForceNodesReRender");
    setRootNode((prevRootNode) => ({
      ...prevRootNode,
      data: {
        ...prevRootNode?.data,
        _forceUpdate: Math.random(), // Harmless, random change
      },
    }));
    console.log(rootNode);
  };

  // Act on changes to the selected node
  useEffect(() => {
    console.log("Selected(Canvas)", selectedNode);
    console.log("TEST", selectedNode.currentId);
    forceReRender();
    forceNodesReRender();
  }, [selectedNode]);

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
        let formattedEdge = {
          id: `edge_${node.currentId}_${node.yesChild[0].currentId}`,
          source: node.currentId,
          target: node.yesChild[0].currentId,
          sourceHandle: "yes",
          className: "tree-flow-yes-edge",
          type: "detailed",
        };
        setEdges((eds) => eds.concat(formattedEdge));
      }

      if (node.noChild[0]) {
        let formattedEdge = {
          id: `edge_${node.currentId}_${node.noChild[0].currentId}`,
          source: node.currentId,
          target: node.noChild[0].currentId,
          sourceHandle: "no",
          className: "tree-flow-no-edge",
          type: "detailed",
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

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        const newEdge = {
          id: `edge_${params.source}_${params.target}`,
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          className:
            params.sourceHandle === "no"
              ? "tree-flow-no-edge"
              : "tree-flow-yes-edge",
          type: "detailed",
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
   * Updates the position of a node in the decision tree.
   * @param {string} nodeIdToUpdate - The ID of the node to update.
   * @param {Object} newPos - The new position of the node with x and y coordinates.
   */
  const updateNodePosition = (nodeIdToUpdate, newPos) => {
    const updatePositionRecursively = (node) => {
      if (node.currentId === nodeIdToUpdate) {
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
          <button style={{ margin: "5px" }}>Add Yes</button>
          <button style={{ margin: "5px" }}>Add No</button>
          <button style={{ margin: "5px" }}>Delete</button>
          <button style={{ margin: "5px" }}>Lock Angle</button>
        </div>
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};

const NodeFlow = ({ rootNode, setRootNode }) => {
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
        <NodeFlowInstance rootNode={rootNode} setRootNode={setRootNode} />
      </ReactFlowProvider>
    </div>
  );
};

export default NodeFlow;
