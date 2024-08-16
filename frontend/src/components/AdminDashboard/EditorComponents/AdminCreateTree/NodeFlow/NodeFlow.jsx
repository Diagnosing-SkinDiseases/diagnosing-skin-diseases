import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import "../../../../CSS/Admin/TreeEditorNodeFlow.css";

import QuestionInput from "./FlowComponents/QuestionInput";

const nodeTypes = { questionInput: QuestionInput };

const getNodeId = () => `randomnode_${+new Date()}`;

const flowKey = "example-flow";

const NodeFlowInstance = ({ rootNode, setRootNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [maxTreeHeight, setMaxTreeHeight] = useState(0);
  const [savedXOffset, setSavedXOffset] = useState(0);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();
  // Node ID state
  const [idCounter, setIdCounter] = useState(0);

  // Load existing nodes once on page load
  useEffect(() => {
    setNodes([]);
    loadExistingTree();
    setDataLoaded(true);
  }, []);

  // print max counter
  useEffect(() => {
    console.log("idCounter", idCounter);
  }, [idCounter]);

  // useEffect(() => {
  //   console.log("Flow Nodes", nodes);
  // }, [nodes]);

  useEffect(() => {
    if (dataLoaded) {
      console.log("ln", loadedNodes);
      console.log("rn", rootNode);
      console.log("fn", flattenTree(rootNode));
      setNodes((nds) => {
        const filtered = nds.filter((flowNode) => {
          const keepIds = flattenTree(rootNode).map((node) => node.currentId);
          console.log("keepIds", keepIds);
          console.log("currIds", nds);
          console.log(keepIds.includes(flowNode.id));
          return keepIds.includes(flowNode.id);
        });
        return filtered;
      });

      const filtered = loadedNodes.filter((flowNode) => {
        const keepIds = flattenTree(rootNode).map((node) => node.currentId);
        // console.log("keepIds", keepIds);
        // console.log("currIds", loadedNodes);
        // console.log(keepIds.includes(flowNode.id));
        return keepIds.includes(flowNode.id);
      });

      setNodes(filtered);
    }
  }, [rootNode, dataLoaded]);

  const loadExistingTree = () => {
    const _loadExistingTree = (node, type) => {
      if (node === undefined) {
        return;
      }

      let currentNodeCounter = parseInt(node.currentId.match(/\d+/)[0]);

      if (currentNodeCounter + 1 > idCounter) {
        setIdCounter(currentNodeCounter + 1);
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

      /**
       *     const newEdge = {
      id: `edge_${id}_${newNode.id}`,
      source: id,
      target: newNode.id,
      sourceHandle: newNodeType,
      className:
        newNodeType === "no" ? "tree-flow-no-edge" : "tree-flow-yes-edge",
    };
       */

      if (node.yesChild[0]) {
        let formattedEdge = {
          id: `edge_${node.currentId}_${node.yesChild[0].currentId}`,
          source: node.currentId,
          target: node.yesChild[0].currentId,
          sourceHandle: "yes",
          className: "tree-flow-yes-edge",
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
        };
        setEdges((eds) => eds.concat(formattedEdge));
      }

      console.log("LOADING NODE", formattedNode);

      setNodes((nds) => nds.concat(formattedNode));

      _loadExistingTree(node.noChild[0], "no");
      _loadExistingTree(node.yesChild[0], "yes");
    };
    console.log("Root pre load", rootNode);

    _loadExistingTree(rootNode, "root");
  };

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
    },
  }));

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        console.log("pr", params);
        console.log("ed", eds);
        return addEdge(params, eds);
      }),
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  function findFlowNodeById(nodes, id) {
    return nodes.find((node) => {
      // console.log(node);
      return node.id === id;
    });
  }

  const onAdd = useCallback(() => {
    console.log(nodes);
    let foundNode = findFlowNodeById(nodes, "1");
    console.log(foundNode);
    const newNode = {
      id: getNodeId(),
      data: { label: "Added node" },
      type: "questionInput",
      position: {
        x: foundNode.position.x - 200,
        y: foundNode.position.y + 250,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

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

  const handleNodeDragStop = (event, node) => {
    updateNodePosition(node.id, node.position);

    console.log("Drag V", node);
    console.log("Drag NPrev", findTreeNodeById(rootNode, node.id));

    console.log(`NewPos {x: ${node.position.x}, y: ${node.position.y}} `);
  };

  useEffect(() => {
    onSave();
  }, [onSave]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      fitView
      fitViewOptions={{ padding: 2 }}
      nodeTypes={nodeTypes}
      minZoom={0.1} // Set the minimum zoom level (zoom out)
      deleteKeyCode={"Disabled"}
      onNodeDragStop={handleNodeDragStop}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
      {/* <Panel position="top-right">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button>
      </Panel> */}
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
