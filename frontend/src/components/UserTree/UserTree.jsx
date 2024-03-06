import React, { useEffect, useState } from 'react';
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

    const [nodeRows, setNodeRows] = useState([]);

    useEffect(() => {
        const nodesByLevel = buildNodesByLevel(DUMMY_DATA.nodes);
        const nodeElements = createNodeElements(nodesByLevel);
        setNodeRows(nodeElements);

        DUMMY_DATA.nodes.forEach(node => {
            if (node.noChildId) {
                drawArrow(node.currentId, node.noChildId, redArrow);
            }
            if (node.yesChildId) {
                drawArrow(node.currentId, node.yesChildId, greenArrow);
            }
        });
    }, []);

    const buildNodesByLevel = (nodes) => {
        let levels = {};
        nodes.forEach(node => {
            let level = node.parentId ? levels[node.parentId].level + 1 : 0;
            if (!levels[level]) levels[level] = [];
            levels[level].push({ ...node, level });
            levels[node.currentId] = levels[level][levels[level].length - 1];
        });
        return levels;
    };

    const createNodeElements = (nodesByLevel) => {
        return Object.values(nodesByLevel).map((nodes, levelIndex) => {
            if (!Array.isArray(nodes)) {
                return null;
            }

            let rowElements = [];
            nodes.forEach(node => {
                rowElements.push(
                    <div key={node.currentId} className="node">
                        <NodeComponent color={blueNode} id={node.currentId} />
                    </div>
                );
                if (!node.noChildId) {
                    rowElements.push(
                        <div key={`invis-no-${node.currentId}`} className="node">
                            <InvisibleNodeComponent />
                        </div>
                    );
                }
                if (!node.yesChildId) {
                    rowElements.push(
                        <div key={`invis-yes-${node.currentId}`} className="node">
                            <InvisibleNodeComponent />
                        </div>
                    );
                }
            });

            return (
                <div key={`node-row-${levelIndex}`} className={`node-row level-${levelIndex}`}>
                    {rowElements}
                </div>
            );
        });
    };

    return (
        <>
            <br />
            <div>
                <SymbolIndication />
                <div className="user-tree">
                    {nodeRows}
                </div>
            </div>
        </>
    );
};

export default UserTree