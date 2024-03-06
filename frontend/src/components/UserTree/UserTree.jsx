import React, { useEffect } from 'react';
import { NodeComponent, InvisibleNodeComponent } from './NodeComponent';
import NodeDetails from './NodeDetails';
import './UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';
import DUMMY_DATA from './DummyTree';

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
            console.log(color + "line drawn between " + start + " and " + end);
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

    useEffect(() => {
        DUMMY_DATA.nodes.forEach(node => {
            if (node.noChildId) {
                drawArrow(node.currentId, node.noChildId, redArrow);
            }
            if (node.yesChildId) {
                drawArrow(node.currentId, node.yesChildId, greenArrow);
            }
        });
    }, []);

    // Function to recursively render nodes and their children, including invisible nodes for spacing
    const renderNodes = (parentId = null, level = 0) => {
        const children = DUMMY_DATA.nodes.filter(node => node.parentId === parentId);

        // Initialize nodes array with nulls for all positions at the current level
        let nodes;
        if (parentId === null) {
            // If it's the root node, the array should only contain one node
            nodes = [children.find(child => child.parentId === null)];
        } else {
            // Initialize nodes array with nulls for all positions at the current level
            const maxChildren = 2;
            nodes = new Array(maxChildren).fill(null);

            // Map the children to their correct positions
            children.forEach(child => {
                const parentIndex = DUMMY_DATA.nodes.findIndex(node => node.currentId === child.parentId);
                const parentNode = DUMMY_DATA.nodes[parentIndex];

                if (parentNode.noChildId === child.currentId) {
                    nodes[0] = child; // Left child
                    console.log("left child: " + child.currentId);
                } else if (parentNode.yesChildId === child.currentId) {
                    nodes[1] = child; // Right child
                    console.log("right child: " + child.currentId);
                }
            });
        }

        return (
            <div className={`node-row ${level}-row`}>
                {nodes.map((node, index) => node ? (
                    <div key={node.currentId} className="node">
                        <NodeComponent color={blueNode} id={node.currentId} />
                        {renderNodes(node.currentId, level + 1)}
                    </div>
                ) : (
                    // Render invisible placeholder if the node is null
                    <div key={`invisible-${level}-${index}`} className="node">
                        <InvisibleNodeComponent />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <br />
            <div>
                <SymbolIndication />
                <div className="user-tree">
                    {renderNodes()}
                </div>
            </div>
        </>
    );
};

export default UserTree