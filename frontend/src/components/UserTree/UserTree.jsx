import React, { useEffect, useState, useRef } from 'react';
import { NodeComponent, InvisibleNodeComponent } from './NodeComponent';
import NodeDetails from './NodeDetails';
import './UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';
import ZoomControls from './ZoomControls';

// Global variable to store the leader lines
let arrows = [];


// Draw an arrow between two nodes
// Source from: https://github.com/anseki/leader-line
const drawArrow = (start, end, color) => {
    if (window.LeaderLine && document.getElementById(start) && document.getElementById(end)) {
        const line = new window.LeaderLine(
            document.getElementById(start),
            document.getElementById(end),
            {
                color: color,
                path: 'straight',
                startSocket: 'bottom',
                endSocket: 'top',
                size: 4, // Set the line size
            }
        );

        arrows.push(line);
        // Store the line for later removal
        return line;
    }
};

const UserTree = ({ treeData }) => { // Destructure treeData from props
    const [zoomLevel, setZoomLevel] = useState(1);

    const greenArrow = "#3fc005";
    const redArrow = "#f44336";
    const blueNode = "#1E90FF";
    const yellowNode = "#FFD700";
    const greenNode = "#6ad669";

    const [nodeRows, setNodeRows] = useState([]);
    const [currentNodeId, setCurrentNodeId] = useState(null);

    const zoomIn = () => setZoomLevel(zoomLevel * 1.1);
    const zoomOut = () => setZoomLevel(zoomLevel / 1.1);

    useEffect(() => {
        if (currentNodeId) {
            const newCurrentNode = document.getElementById(currentNodeId);
            if (newCurrentNode) {
                newCurrentNode.classList.add('currentNode');
                newCurrentNode.style.backgroundColor = greenNode;
            }
        }
    }, [currentNodeId]); // Add currentNodeId to useEffect dependency array

    useEffect(() => {
        if (!treeData || !treeData.nodes || treeData.nodes.length === 0) {
            console.error('Invalid tree data:', treeData);
            return;
        }

        const maxLevel = findMaxLevel(treeData.nodes);
        const nodesByLevel = placeNodesByLevel(treeData.nodes, maxLevel);

        setNodeRows(nodesByLevel);

        setTimeout(() => colorNodes(treeData.nodes), 0);

        setTimeout(() => drawAllArrows(treeData.nodes), 0);

    }, [treeData]); // Add treeData to useEffect dependency array

    const handleNodeClick = nodeId => {
        setCurrentNodeId(nodeId);
    };

    useEffect(() => {
        // Remove existing arrows before redrawing them
        arrows.forEach(arrow => arrow.remove());
        arrows = [];

        if (nodeRows.length > 0) {
            setTimeout(() => drawAllArrows(treeData.nodes), 0);
        }
    }, [zoomLevel, nodeRows, treeData.nodes]);

    // Inside your UserTree component

    useEffect(() => {
        // Function to redraw arrows
        const redrawArrows = () => {
            // Your logic to remove and redraw arrows goes here
            arrows.forEach(arrow => arrow.remove());
            arrows = [];
            drawAllArrows(treeData.nodes);
        };

        const userTreeContainer = document.querySelector('.user-tree-container');

        userTreeContainer.addEventListener('scroll', redrawArrows);

        return () => userTreeContainer.removeEventListener('scroll', redrawArrows);
    }, [treeData.nodes]);


    const drawAllArrows = (nodes) => {
        arrows.forEach(arrow => arrow.remove());
        arrows = [];

        nodes.forEach(node => {
            if (node.noChildId) {
                drawArrow(node.currentId, node.noChildId, redArrow, arrows);
            }
            if (node.yesChildId) {
                drawArrow(node.currentId, node.yesChildId, greenArrow, arrows);
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
        console.log("Max level:", maxLevel);
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
                nodeElement = <NodeComponent id={node.currentId} color={blueNode} key={node.currentId} />;
                children = [];

                const yesChildId = node.yesChildId;
                const noChildId = node.noChildId;

                if (yesChildId) {
                    children.push(placeNode(yesChildId, level + 1, maxLevel));
                }

                if (noChildId) {
                    children.push(placeNode(noChildId, level + 1, maxLevel));
                }
            }

            // If the node has no children and is not at maxLevel, create invisible nodes
            if ((!node || (!node.yesChildId && !node.noChildId)) && level < maxLevel) {
                nodeElement = nodeElement || <InvisibleNodeComponent key={`invisible-${nodeId || level}`} />;
                children = [
                    placeNode(null, level + 1, maxLevel),
                    placeNode(null, level + 1, maxLevel)
                ];
            }

            return (
                <div className="node-container" key={nodeId || `level-${level}`}>
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
                if (node.yesChildId && node.noChildId) {
                    element.style.backgroundColor = blueNode; // for nodes with both yes and no children
                } else if (!node.yesChildId && !node.noChildId) {
                    element.style.backgroundColor = yellowNode; // for leaf nodes
                }
            } else {
                console.error('Element not found for currentId:', node.currentId);
            }
        });
    };

    return (
        <>
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
                {currentNodeId && (
                    <NodeDetails
                        nodeId={currentNodeId}
                        data={treeData.nodes.find(node => node.currentId === currentNodeId)}
                    />
                )}
                <CurrentNodeDetails
                    question="Question placeholder"
                    onBack={() => console.log("Back clicked")}
                    onNo={() => console.log("No clicked")}
                    onYes={() => console.log("Yes clicked")}
                />
            </div>
        </>
    );
};

export default UserTree;
