import React, { useEffect, useState, useRef } from 'react';
import { NodeComponent, InvisibleNodeComponent } from './NodeComponent';
// import NodeDetails from './NodeDetails';
import './UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';
import ZoomControls from './ZoomControls';

// Global variable to store the leader lines
let arrows = [];


// Draw an arrow between two nodes
// Source from: https://github.com/anseki/leader-line
const drawArrow = (start, end, color, size) => {
    if (window.LeaderLine && document.getElementById(start) && document.getElementById(end)) {
        const line = new window.LeaderLine(
            document.getElementById(start),
            document.getElementById(end),
            {
                color: color,
                path: 'straight',
                startSocket: 'bottom',
                endSocket: 'top',
                size: size, // Set the line size
            }
        );

        arrows.push(line);
        // Store the line for later removal
        return line;
    }
};

const UserTree = ({ treeData }) => { // Destructure treeData from props
    const [zoomLevel, setZoomLevel] = useState(1);
    const treeName = treeData.name;
    const rootQuestion = treeData.nodes[0].content;

    const greenArrow = "#3fc005";
    const redArrow = "#f44336";
    const blueNode = "#1E90FF";
    const yellowNode = "#FFD700";
    const greenNode = "#6ad669";

    const currentNodeIdRef = useRef(null);
    const [nodeRows, setNodeRows] = useState([]);
    const [nodeColors, setNodeColors] = useState({});
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [previousNodeId, setPreviousNodeId] = useState(null);
    const [currentNodeContent, setCurrentNodeContent] = useState(rootQuestion);

    const zoomIn = () => setZoomLevel(zoomLevel * 1.1);
    const zoomOut = () => setZoomLevel(zoomLevel / 1.1);

    // Highlight the current node when currentNodeId changes
    useEffect(() => {
        if (currentNodeId) {
            const newCurrentNode = document.getElementById(currentNodeId);
            if (newCurrentNode) {
                newCurrentNode.classList.add('currentNode');
                newCurrentNode.style.backgroundColor = greenNode;
            }
        }
    }, [currentNodeId]); // Add currentNodeId to useEffect dependency array

    // Update the state when the ref value changes
    useEffect(() => {
        if (!treeData || !treeData.nodes || treeData.nodes.length === 0) {
            console.error('Invalid tree data:', treeData);
            return;
        }

        const maxLevel = findMaxLevel(treeData.nodes);
        const nodesByLevel = placeNodesByLevel(treeData.nodes, maxLevel);

        setNodeRows(nodesByLevel);

        setTimeout(() => colorNodes(treeData.nodes), 1);

        setTimeout(() => drawAllArrows(treeData.nodes), 0);

    }, [treeData]); // Add treeData to useEffect dependency array

    // Initialize or update node colors based on tree data
    useEffect(() => {
        // Initialize or update node colors based on tree data
        const initialColors = {};
        treeData.nodes.forEach(node => {
            initialColors[node.currentId] = node.hasChildren ? blueNode : yellowNode; // Example logic for color assignment
        });
        setNodeColors(initialColors);
    }, [treeData]);

    // Highlight the current node and change the previous node back to its original color
    useEffect(() => {
        const changeNodeColor = (nodeId, color) => {
            const nodeElement = document.getElementById(nodeId);
            if (nodeElement) {
                nodeElement.style.backgroundColor = color;
            }
        };

        if (previousNodeId) {
            changeNodeColor(previousNodeId, blueNode); // Change back to original color
        }
        if (currentNodeId) {
            changeNodeColor(currentNodeId, greenNode); // Highlight the current node
        }
    }, [currentNodeId, previousNodeId]);

    // Update previousNodeId when currentNodeId changes
    useEffect(() => {
        // Skip on initial render when currentNodeId is null
        if (currentNodeId !== null) {
            // Update previousNodeId to the last currentNodeId
            setPreviousNodeId(currentNodeId);
        }
    }, [currentNodeId]);

    // Update currentNodeContent when currentNodeId changes
    useEffect(() => {
        if (!currentNodeId) {
            setCurrentNodeContent(rootQuestion);
        }
    }, [currentNodeId, rootQuestion]);

    // Redraw arrows when zoomLevel, nodeRows, or treeData.nodes change
    useEffect(() => {
        // Remove existing arrows before redrawing them
        arrows.forEach(arrow => arrow.remove());
        arrows = [];

        if (nodeRows.length > 0) {
            setTimeout(() => drawAllArrows(treeData.nodes, zoomLevel), 0);
        }
    }, [zoomLevel, nodeRows, treeData.nodes]);

    // Redraw arrows when the user scrolls
    useEffect(() => {
        // Function to redraw arrows
        const redrawArrows = () => {
            // Your logic to remove and redraw arrows goes here
            arrows.forEach(arrow => arrow.remove());
            arrows = [];
            drawAllArrows(treeData.nodes, zoomLevel);
        };

        const userTreeContainer = document.querySelector('.user-tree-container');

        userTreeContainer.addEventListener('scroll', redrawArrows);

        return () => userTreeContainer.removeEventListener('scroll', redrawArrows);
    }, [treeData.nodes, zoomLevel]);

    // Update the ref value when currentNodeId changes
    useEffect(() => {
        currentNodeIdRef.current = currentNodeId;
    }, [currentNodeId]);

    const handleNodeClick = nodeId => {
        // Find and clear the previous current node
        const prevCurrentNode = document.querySelector('.currentNode');
        if (prevCurrentNode && prevCurrentNode.id !== nodeId) {
            prevCurrentNode.classList.remove('currentNode');
            // Reset the color based on node's original state
            const originalColor = nodeColors[prevCurrentNode.id]; // Assuming nodeColors is defined and populated
            prevCurrentNode.style.backgroundColor = originalColor;
        }

        const node = treeData.nodes.find(n => n.currentId === nodeId);
        setCurrentNodeId(nodeId);
        console.log("Node clicked:", nodeId);
        setCurrentNodeContent(node ? node.content : rootQuestion);

        const newCurrentNode = document.getElementById(nodeId);

        if (newCurrentNode) {
            newCurrentNode.classList.add('currentNode');
            newCurrentNode.style.backgroundColor = greenNode; // Highlight the current node
        }
    };

    const handleNodeHover = nodeId => {
        const node = treeData.nodes.find(n => n.currentId === nodeId);
        if (node) {
            setCurrentNodeContent(node.content); // Update content on hover
        }

        // Mouse leave event to reset content to current node or root node
        const nodeElement = document.getElementById(nodeId);
        if (nodeElement) {
            nodeElement.onmouseleave = () => {
                const currentId = currentNodeIdRef.current;
                // console.log("mouse leave, current NodeId:", currentId);
                const currentNode = currentId ? treeData.nodes.find(n => n.currentId === currentId) : null;
                setCurrentNodeContent(currentNode ? currentNode.content : rootQuestion);
            };
        }
    };

    const drawAllArrows = (nodes, zoomLevel = 1) => {
        arrows.forEach(arrow => arrow.remove());
        arrows = [];

        const baseSize = 2.5; // Base size of the arrow
        const scaledSize = baseSize * zoomLevel; // Scale size based on zoom level

        nodes.forEach(node => {
            if (node.noChildId) {
                drawArrow(node.currentId, node.noChildId, redArrow, scaledSize);
            }
            if (node.yesChildId) {
                drawArrow(node.currentId, node.yesChildId, greenArrow, scaledSize);
            }
        });
    };

    const findMaxLevel = nodes => {
        let maxLevel = 0;
        const findLevel = (nodeId, level) => {
            const node = nodes.find(n => n.currentId === nodeId);
            if (node) {
                maxLevel = Math.max(maxLevel, level);
                findLevel(node.yesChildId, level + 1);
                findLevel(node.noChildId, level + 1);
            }
        };
        findLevel(nodes[0].currentId, 0);
        // console.log("Max level:", maxLevel);
        return maxLevel;
    };

    // Place nodes by level
    const placeNodesByLevel = (nodes, maxLevel) => {
        if (!nodes || nodes.length === 0) return [];

        const placeNode = (nodeId, level, maxLevel) => {
            if (level > maxLevel) return null;

            const node = nodeId ? nodes.find(n => n.currentId === nodeId) : null;

            let nodeElement, children;
            if (node) {
                nodeElement = <NodeComponent id={node.currentId} color={blueNode} key={node.currentId} onClick={() => handleNodeClick(node.currentId)} onMouseEnter={() => handleNodeHover(node.currentId)} />;
                children = [];

                const yesChildId = node.yesChildId;
                const noChildId = node.noChildId;

                if (yesChildId) {
                    children.push(placeNode(yesChildId, level + 1, maxLevel));
                }

                if (noChildId) {
                    children.push(placeNode(noChildId, level + 1, maxLevel));
                }
            } else {
                // Generate a unique key for invisible nodes
                nodeElement = <InvisibleNodeComponent key={`invisible-${level}-${Math.random()}`} />;
                children = [
                    placeNode(null, level + 1, maxLevel),
                    placeNode(null, level + 1, maxLevel)
                ];
            }

            return (
                <div className="node-container" key={nodeId || `level-${level}-${Math.random()}`}>
                    {nodeElement}
                    <div className="node-children">
                        {children}
                    </div>
                </div>
            );
        };


        return [placeNode(nodes[0]?.currentId, 0, maxLevel)];
    };

    const colorNodes = nodes => {
        nodes.forEach(node => {
            const element = document.getElementById(node.currentId);
            if (element) {
                const nodeColor = nodeColors[node.currentId] || (node.yesChildId && node.noChildId ? blueNode : yellowNode);
                element.style.backgroundColor = nodeColor;
            } else {
                console.error('Element not found for currentId:', node.currentId);
            }
        });
    };

    return (
        <>
            <div id="user-tree-page">
                <h1 id="tree-name" style={{ opacity: zoomLevel > 1 ? 0 : 1 }}>{treeName}</h1>
                <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
                <div className="user-tree-container">
                    <SymbolIndication />
                    <div className="user-tree" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}>
                        {nodeRows.map((nodeRow, index) => (
                            <div key={`node-row-${index}`} className={`node-row level-${index}`}>
                                {nodeRow}
                            </div>
                        ))}
                    </div>
                    <CurrentNodeDetails
                        question={currentNodeContent}
                        onBack={() => console.log("Back clicked")}
                        onNo={() => console.log("No clicked")}
                        onYes={() => console.log("Yes clicked")}
                    />
                </div>
            </div>
        </>
    );
};

export default UserTree;
