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
import "../../../../CSS/UserTreeV2.css";

import QuestionInput from "./FlowComponents/QuestionInput";
import DetailedEdge from "./FlowComponents/DetailedEdge";
import HeightControls from "./FlowComponents/HeightControls";
import LengthControls from "./FlowComponents/LengthControls";
import AngleControls from "./FlowComponents/AngleControls";

const nodeTypes = { questionInput: QuestionInput };

const getNodeId = () => `randomnode_${+new Date()}`;

const flowKey = "example-flow";

const DEFAULT_NEW_NODE_HEIGHT = 350;
const DEFAULT_NEW_NODE_X_OFFSET = 200;

const findTreeNodeById = (rootNode, targetNodeId) => {
  const find = (node) => {
    if (node === undefined || node === null) {
      return undefined;
    }

    if (node.currentId === targetNodeId) {
      return node;
    }

    const noResult = find(node.noChild[0]);
    const yesResult = find(node.yesChild[0]);

    return noResult || yesResult;
  };

  return find(rootNode);
};

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

const NodeFlowInstance = ({
  rootNode,
  setRootNode,
  existingMidOffsets,
  setExistingMidOffsets,
}) => {
  /*
   * ============================================================
   * EDITOR STATE
   * ============================================================
   */

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [idCounter, setIdCounter] = useState(0);

  const [selectedNode, setSelectedNode] = useState(
    findTreeNodeById(rootNode, "node0"),
  );

  const [canvasKey, setCanvasKey] = useState(0);

  const forceReRender = () => {
    setCanvasKey((prevKey) => prevKey + 1);
  };

  const [maxTreeHeight, setMaxTreeHeight] = useState(0);
  const [savedXOffset, setSavedXOffset] = useState(0);
  const [rfInstance, setRfInstance] = useState(null);

  const { setViewport } = useReactFlow();

  /*
   * ============================================================
   * LINK BUILDER
   * ============================================================
   */

  const [showLinkBuilder, setShowLinkBuilder] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkHref, setLinkHref] = useState("");

  const generatedLink = `<br/><a href="${linkHref}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;

  /*
   * ============================================================
   * INITIAL TREE LOADING
   * ============================================================
   */

  useEffect(() => {
    setNodes([]);
    setIdCounter(loadExistingTree());
    setDataLoaded(true);
  }, []);

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

  function findEdgeByNodes(edges, currentNodeId, parentNodeId) {
    return (
      edges.find(
        (edge) => edge.source === parentNodeId && edge.target === currentNodeId,
      ) || null
    );
  }

  const forceNodesReRender = () => {
    setRootNode((prevRootNode) => ({
      ...prevRootNode,
      data: {
        ...prevRootNode?.data,
        _forceUpdate: Math.random(),
      },
    }));
  };

  useEffect(() => {
    if (selectedNode) {
      forceReRender();
      forceNodesReRender();
    }
  }, [selectedNode]);

  /*
   * ============================================================
   * MIDPOINT OFFSET DATA
   * ============================================================
   */

  const findMidOffset = (edgeId) => {
    const match = existingMidOffsets?.find((e) => e.edgeId === edgeId);

    return match?.midOffset || { x: 0, y: 0 };
  };

  /*
   * ============================================================
   * CONVERT SAVED TREE TO REACT FLOW
   * ============================================================
   */

  const loadExistingTree = () => {
    const load = (node, type, maxCounter) => {
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
        position: {
          x: node.xPos,
          y: node.yPos,
        },
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

      let noMax = load(node.noChild[0], "no", maxCounter);

      let yesMax = load(node.yesChild[0], "yes", maxCounter);

      return Math.max(noMax, yesMax);
    };

    let loadedCounter = load(rootNode, "root", 0);

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

  useEffect(() => {
    if (typeof existingMidOffsets === "undefined") {
      return;
    }

    setExistingMidOffsets(extractMidOffsets(edges));
  }, [edges]);

  useEffect(() => {}, [existingMidOffsets]);

  /*
   * ============================================================
   * TREE UTILITIES
   * ============================================================
   */

  function flattenTree(tree) {
    const result = [];

    function traverse(node) {
      if (!node) return;

      result.push(node);

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
      xPos: 0,
      yPos: 0,
    };

    return newNode;
  }

  const updateNodeContent = (nodeIdToUpdate, newContent) => {
    const updateContentRecursively = (node) => {
      if (node.currentId === nodeIdToUpdate) {
        return {
          ...node,
          content: newContent,
        };
      }

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

  /*
   * ============================================================
   * MULTI-SELECTION
   * ============================================================
   */

  const [multiSelectOn, setMultiSelectOn] = useState(false);

  const [multiSelectList, setMultiSelectList] = useState([]);

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

  /*
   * ============================================================
   * INJECT EDITOR DATA INTO NODES
   * ============================================================
   */

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

  /*
   * ============================================================
   * TREE RELATIONSHIP OPERATIONS
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

    setSelectedNode(findTreeNodeById(newRootNode, selectedNode.currentId));
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

    setSelectedNode(findTreeNodeById(updatedRootNode, selectedNode.currentId));
  };

  /*
   * ============================================================
   * MANUAL CONNECTION CREATION
   * ============================================================
   */

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
    [setEdges, rootNode],
  );

  /*
   * ============================================================
   * NODE DELETION
   * ============================================================
   */

  const deleteFlowNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.currentId));
  };

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

  const onDeleteNode = (event) => {
    deleteFlowNode();
    deleteChild();
    setSelectedNode(null);
  };

  /*
   * ============================================================
   * NODE CREATION
   * ============================================================
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

  const onAddYesNode = () => {
    addNewNode("yes");
  };

  const onAddNoNode = () => {
    addNewNode("no");
  };

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

      onAddYesNode();
    } else {
      newNode.xPos =
        selectedNode.xPos - (DEFAULT_NEW_NODE_X_OFFSET + savedXOffset);

      addNoChild(targetNodeId, newNode);

      onAddNoNode();
    }
  };

  const addYesChildToSelectedNode = () => {
    onAddNode("yes");
  };

  const AddNoChildToSelectedNode = () => {
    onAddNode("no");
  };

  /*
   * ============================================================
   * NODE DRAGGING AND POSITION UPDATES
   * ============================================================
   */

  const [initialY, setInitialY] = useState(null);

  const [lockedY, setLockedY] = useState(false);

  const handleNodeDragStart = (event, node) => {
    setInitialY(node.position.y);
  };

  const handleNodeDrag = (event, node) => {
    if (lockedY) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                position: {
                  x: node.position.x,
                  y: initialY,
                },
              }
            : n,
        ),
      );
    } else {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                position: {
                  x: node.position.x,
                  y: node.position.y,
                },
              }
            : n,
        ),
      );
    }
  };

  const updateNodePosition = (nodeIdToUpdate, newPos) => {
    const updatePositionRecursively = (node) => {
      if (node.currentId === nodeIdToUpdate) {
        if (lockedY) {
          newPos.y = initialY;
        }

        return {
          ...node,
          xPos: newPos.x,
          yPos: newPos.y,
        };
      }

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
  };

  /*
   * ============================================================
   * DEDUPLICATION
   * ============================================================
   */

  const deduplicateNodes = (nodes) => {
    const seen = new Set();

    return nodes.filter((node) => {
      if (seen.has(node.id)) {
        return false;
      }

      seen.add(node.id);
      return true;
    });
  };

  const deduplicateEdges = (edges) => {
    const seen = new Set();

    return edges.filter((edge) => {
      if (seen.has(edge.id)) {
        return false;
      }

      seen.add(edge.id);
      return true;
    });
  };

  useEffect(() => {
    setEdges((prevEdges) => deduplicateEdges(prevEdges));

    setNodes((prevNodes) => deduplicateNodes(prevNodes));
  }, []);

  /*
   * ============================================================
   * REACT FLOW RENDERING
   * ============================================================
   *
   * The Admin Editor now uses its own local
   * DetailedEdge wrapper.
   *
   * Edges remain behind nodes.
   */

  return (
    <ReactFlow
      className="admin-tree-editor-flow"
      nodes={nodes}
      edges={edges}
      edgeTypes={{
        detailed: DetailedEdge,
      }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      fitView
      fitViewOptions={{
        padding: 0.1,
      }}
      nodeTypes={nodeTypes}
      minZoom={0.05}
      deleteKeyCode={"Disabled"}
      onNodeDragStop={handleNodeDragStop}
      onNodeDragStart={handleNodeDragStart}
      onNodeDrag={handleNodeDrag}
      elevateEdgesOnSelect={false}
      elevateNodesOnSelect={false}
      proOptions={{
        hideAttribution: true,
      }}
    >
      {/*
       * Keep all editor edges below nodes.
       * These rules are scoped to this editor.
       */}
      <style>
        {`
          .admin-tree-editor-flow .react-flow__edges {
            z-index: 0 !important;
          }

          .admin-tree-editor-flow .react-flow__nodes {
            z-index: 1 !important;
          }

          .admin-tree-editor-flow .react-flow__edge {
            z-index: 0 !important;
          }
        `}
      </style>

      <Panel position="top-right">
        <div
          style={{
            backgroundColor: "lightgrey",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "8px",
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
          />

          <LengthControls
            selectedNode={selectedNode}
            rootNode={rootNode}
            findTreeNodeById={findTreeNodeById}
            setRootNode={setRootNode}
            setNodes={setNodes}
            multiSelectOn={multiSelectOn}
            multiSelectList={multiSelectList}
          />

          <AngleControls
            selectedNode={selectedNode}
            rootNode={rootNode}
            findTreeNodeById={findTreeNodeById}
            setRootNode={setRootNode}
            setNodes={setNodes}
            multiSelectOn={multiSelectOn}
            multiSelectList={multiSelectList}
          />

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

          <button
            className="tree-flow-panel-btn"
            onClick={() => setShowLinkBuilder(!showLinkBuilder)}
          >
            {showLinkBuilder ? "Hide Link Builder" : "Add Link"}
          </button>

          {showLinkBuilder && (
            <div
              style={{
                marginTop: "1em",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <input
                type="text"
                placeholder="Text to display"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                style={{
                  marginBottom: "0.5em",
                }}
              />

              <input
                type="text"
                placeholder="Target URL"
                value={linkHref}
                onChange={(e) => setLinkHref(e.target.value)}
                style={{
                  marginBottom: "0.5em",
                }}
              />

              <textarea
                className="tree-flow-link-output"
                placeholder="Generated Link"
                readOnly
                value={linkText && linkHref ? generatedLink : ""}
                rows={1}
                style={{
                  resize: "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.target.select();

                  navigator.clipboard
                    .writeText(e.target.value)
                    .then(() => {})
                    .catch((err) => {
                      console.error("Failed to copy: ", err);
                    });

                  e.target.blur();
                }}
              />
            </div>
          )}
        </div>
      </Panel>

      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};

export default NodeFlow;
