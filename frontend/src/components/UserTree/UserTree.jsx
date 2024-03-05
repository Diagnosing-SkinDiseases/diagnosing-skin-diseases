import React, { useEffect } from 'react';
import NodeComponent from './NodeComponent';
import NodeDetails from './NodeDetails';
import './UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';

const DUMMY_DATA = {
    "_id": "65cf3632790be1df5b052ce4",
    "name": "Lesion",
    "nodes": [
        {
            "currentId": "node1",
            "content": "The question for node 1?",
            "parentId": null,
            "noChildId": "node2",
            "yesChildId": "node3",
            "_id": "65cf3632790be1df5b052ce5"
        },
        {
            "currentId": "node2",
            "content": "The question for node 2?",
            "parentId": "node1",
            "noChildId": null,
            "yesChildId": "node4",
            "_id": "65cf3632790be1df5b052ce6"
        },
        {
            "currentId": "node4",
            "content": "The question for node 3?",
            "parentId": "node2",
            "noChildId": null,
            "yesChildId": null,
            "_id": "65cf3632790be1df5b052ce7"
        },
        {
            "currentId": "node3",
            "content": "The question for node 4?",
            "parentId": "node1",
            "noChildId": null,
            "yesChildId": null,
            "_id": "65cf3632790be1df5b052ce8"
        }
    ],
    "about": "Sample",
    "status": "PUBLISHED",
    "__v": 0
}

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
            console.log("line drawn between " + start + " and " + end);

            // Optionally, store the line reference for later removal
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
    const invisibleNode = "rgba(0,0,0,0)"; // Color for invisible nodes

    useEffect(() => {
        // Assuming drawArrow is a function that takes IDs of two nodes and the color of the arrow.
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
        // Find the children of the current node
        const children = DUMMY_DATA.nodes.filter(node => node.parentId === parentId);
        const childrenCount = children.length;
        const maxChildren = Math.pow(2, level); // Max children at current level

        // Create an array to hold both visible and invisible nodes
        const nodes = new Array(maxChildren).fill(null);

        // Fill the nodes array with either actual children or null (for invisible placeholders)
        children.forEach((child, index) => {
            nodes[index] = child;
        });

        // Render the nodes array as node components
        return (
            <div className={`node-row ${level}-row`}>
                {nodes.map((node, index) => {
                    if (node) {
                        // Render actual node
                        return (
                            <div key={node.currentId} className="node">
                                <NodeComponent color={blueNode} id={node.currentId} />
                                {renderNodes(node.currentId, level + 1)}
                            </div>
                        );
                    } else {
                        // Render invisible placeholder
                        return <div key={`invisible-${level}-${index}`} className="node invisible-node"></div>;
                    }
                })}
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