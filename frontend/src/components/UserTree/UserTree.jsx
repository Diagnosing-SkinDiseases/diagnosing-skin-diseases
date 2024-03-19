import React, { useEffect, useState } from 'react';
import { NodeComponent, InvisibleNodeComponent } from './NodeComponent';
import NodeDetails from './NodeDetails';
import './UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';
import DUMMY_DATA from './DummyTree';

// Draw an arrow between two nodes
// Source from: https://github.com/anseki/leader-line
const drawArrow = (start, end, color) => {
    requestAnimationFrame(() => {
        if (window.LeaderLine && document.getElementById(start) && document.getElementById(end)) {
            // Create a line using point anchors to connect the center of each element
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
            // console.log(color + "line drawn between " + start + " and " + end);
            return line;
        }
    });
};

const UserTree = () => {
    const greenArrow = "#3fc005";
    const redArrow = "#f44336";
    const blueNode = "#1E90FF";
    const yellowNode = "#FFD700";
    const greenNode = "#6ad669";

    const [nodeRows, setNodeRows] = useState([]);
    const [currentNodeId, setCurrentNodeId] = useState(null);

    const handleNodeClick = (nodeId) => {
        setCurrentNodeId(nodeId);
    };

    useEffect(() => {
        const maxLevel = findMaxLevel(DUMMY_DATA.nodes);
        const nodesByLevel = placeNodesByLevel(DUMMY_DATA.nodes, maxLevel);

        setNodeRows(nodesByLevel);

        // Draw arrows between each parent/child pair
        DUMMY_DATA.nodes.forEach(node => {
            if (node.noChildId) {
                drawArrow(node.currentId, node.noChildId, redArrow);
            }
            if (node.yesChildId) {
                drawArrow(node.currentId, node.yesChildId, greenArrow);
            }
        });

        setTimeout(() => {
            colorNodes(DUMMY_DATA.nodes);
        }, 0);
    }, []);

    // Update color when current node changes
    useEffect(() => {
        // Find and clear the previous current node
        const prevCurrentNode = document.querySelector('.currentNode');
        if (prevCurrentNode) {
            prevCurrentNode.classList.remove('currentNode');
            // Reset the color based on whether it's a question node or a result node
            const nodeId = prevCurrentNode.id;
            const nodeData = DUMMY_DATA.nodes.find(node => node.currentId === nodeId);
            if (nodeData) {
                const color = nodeData.yesChildId && nodeData.noChildId ? blueNode
                    : (nodeData.noChildId == null && nodeData.yesChildId == null) ? yellowNode
                        : ''; // Default color
                prevCurrentNode.style.backgroundColor = color;
            }
        }

        // Set the new current node
        if (currentNodeId) {
            const newCurrentNode = document.getElementById(currentNodeId);
            if (newCurrentNode) {
                newCurrentNode.classList.add('currentNode');
                newCurrentNode.style.backgroundColor = greenNode; // Set the new current node color to green
            }
        }
    }, [currentNodeId]); // Triggered when currentNodeId changes

    // Find the maximum level of the tree
    const findMaxLevel = (nodes) => {
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
        return maxLevel;
    };

    // Recursively place nodes at the correct position in the tree
    const placeNodesByLevel = (nodes, maxLevel) => {
        // Initialize the rows for each level
        let rows = Array.from({ length: maxLevel + 1 }, () => []);

        // Place an invisible node at given level and position
        const placeInvisibleNode = (level, position) => {
            if (!rows[level]) rows[level] = [];
            rows[level][position] = (
                <div key={`invisible-${level}-${position}`} className="node invisible">
                    <InvisibleNodeComponent />
                </div>
            );
        };

        // Recursive function to place nodes at the correct position
        const placeNode = (nodeId, level, position) => {
            if (level > maxLevel) return; // Exit if beyond the max level
            const node = nodes.find(n => n.currentId === nodeId);
            if (!node) return; // Exit if the node doesn't exist

            if (!rows[level]) rows[level] = [];
            // Place the node at the correct position in the row
            rows[level][position] = (
                <div key={node.currentId}
                    className={`node ${currentNodeId === node.currentId ? 'currentNode' : ''}`}
                    onClick={() => handleNodeClick(node.currentId)}>
                    <NodeComponent id={node.currentId} color={blueNode} />
                </div>
            );

            // Position of children nodes
            const leftPosition = position * 2;
            const rightPosition = leftPosition + 1;

            // Recursively place child nodes
            if (node.yesChildId) {
                placeNode(node.yesChildId, level + 1, rightPosition);
            }
            if (node.noChildId) {
                placeNode(node.noChildId, level + 1, leftPosition);
            }

            // Add invisible nodes if no children
            if (node.yesChildId == null && node.noChildId == null) {
                placeInvisibleNode(level + 1, position);
            }
        };

        // Start with the root node
        if (nodes.length > 0) {
            placeNode(nodes[0].currentId, 0, 0);
        }

        return rows.map((row, level) => (
            <div key={`node-row-${level}`} className={`node-row level-${level}`}>
                {row}
            </div>
        ));
    };

    // Color the nodes based on if they are result node
    const colorNodes = (nodes) => {
        nodes.forEach(node => {
            const element = document.getElementById(node.currentId);
            if (element) {
                if (node.yesChildId && node.noChildId) {
                    element.style.backgroundColor = blueNode;
                }
                if (node.noChildId == null && node.yesChildId == null) {
                    element.style.backgroundColor = yellowNode;
                }
            } else {
                console.error('Element not found for currentId:', node.currentId);
            }
        });
    };


    return (
        <>
            <div className="user-tree">
                {nodeRows}
                <SymbolIndication />
                <CurrentNodeDetails
                    question="Question place holder"
                    onBack={() => console.log("Back clicked")}
                    onNo={() => console.log("No clicked")}
                    onYes={() => console.log("Yes clicked")}
                />
            </div>
        </>
    );
};

export default UserTree;