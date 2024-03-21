import React, { useEffect, useState } from 'react';
import { NodeComponent, InvisibleNodeComponent } from './NodeComponent';
import NodeDetails from './NodeDetails';
import './UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';


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

const UserTree = ({ treeData }) => { // Destructure treeData from props
    const greenArrow = "#3fc005";
    const redArrow = "#f44336";
    const blueNode = "#1E90FF";
    const yellowNode = "#FFD700";
    const greenNode = "#6ad669";

    const [nodeRows, setNodeRows] = useState([]);
    const [currentNodeId, setCurrentNodeId] = useState(null);

    useEffect(() => {
        if (!treeData || !treeData.nodes || treeData.nodes.length === 0) {
            console.error('Invalid tree data:', treeData);
            return;
        }

        const maxLevel = findMaxLevel(treeData.nodes);
        const nodesByLevel = placeNodesByLevel(treeData.nodes, maxLevel);

        setNodeRows(nodesByLevel);

        treeData.nodes.forEach(node => {
            if (node.noChildId) {
                drawArrow(node.currentId, node.noChildId, redArrow);
            }
            if (node.yesChildId) {
                drawArrow(node.currentId, node.yesChildId, greenArrow);
            }
        });

        colorNodes(treeData.nodes);

    }, [treeData]); // Add treeData to useEffect dependency array

    useEffect(() => {
        if (currentNodeId) {
            const newCurrentNode = document.getElementById(currentNodeId);
            if (newCurrentNode) {
                newCurrentNode.classList.add('currentNode');
                newCurrentNode.style.backgroundColor = greenNode;
            }
        }
    }, [currentNodeId]); // Add currentNodeId to useEffect dependency array

    const handleNodeClick = nodeId => {
        setCurrentNodeId(nodeId);
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

        const placeNode = (nodeId, level, maxLevel, nodes) => {
            if (level > maxLevel) return null;

            const node = nodes.find(n => n.currentId === nodeId);
            if (!node) {
                return level < maxLevel ? [<InvisibleNodeComponent key={`invisible-${level}`} />] : null;
            }

            let nodeElement = <NodeComponent id={node.currentId} color={blueNode} key={node.currentId} />;
            let children = [];

            if (node.yesChildId || level < maxLevel) {
                children.push(placeNode(node.yesChildId, level + 1, maxLevel, nodes));
            }

            if (node.noChildId || level < maxLevel) {
                children.push(placeNode(node.noChildId, level + 1, maxLevel, nodes));
            }

            return (
                <div className="node-container" key={node.currentId}>
                    {nodeElement}
                    <div className="node-children">
                        {children}
                    </div>
                </div>
            );
        };

        return [placeNode(nodes[0]?.currentId, 0, maxLevel, nodes)];
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
            <div className="user-tree-container">
                <div className="user-tree">
                    {nodeRows.map((nodeRow, index) => (
                        <div key={`node-row-${index}`} className={`node-row level-${index}`}>
                            {nodeRow}
                        </div>
                    ))}
                </div>
                <SymbolIndication />
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
