import React, { useEffect } from 'react';
import NodeComponent from './NodeComponent';
import NodeDetails from './NodeDetails';
import './UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';

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

    useEffect(() => {
        let line;

        /* LeaderLine source: https://anseki.github.io/leader-line/ */
        drawArrow("node1", "node2", redArrow);
        drawArrow("node1", "node3", greenArrow);
        drawArrow("node2", "node4", redArrow);
        drawArrow("node2", "node5", greenArrow);
        drawArrow("node3", "node6", redArrow);
        drawArrow("node3", "node7", greenArrow);

        return () => {
            if (line) {
                line.remove();
                console.log("line removed");
            }
        };
    }, []);


    return (
        <>
            <br />
            <div>
                <SymbolIndication />
                <div className="user-tree">
                    <div id="first-row"><NodeComponent color={blueNode} id="node1" /></div>
                    <div id="second-row">
                        <NodeComponent color={blueNode} id="node2" class="second-row-nodes" />
                        <NodeComponent color={blueNode} id="node3" class="second-row-nodes" />
                    </div>
                    <div id="third-row">
                        <NodeComponent color={yellowNode} id="node4" class="second-row-nodes" />
                        <NodeComponent color={yellowNode} id="node5" class="second-row-nodes" />
                        <NodeComponent color={yellowNode} id="node6" class="second-row-nodes" />
                        <NodeComponent color={greenNode} id="node7" class="second-row-nodes" />
                    </div>

                </div>
                <div>
                    <CurrentNodeDetails
                        question="Are the spots blanchable?"
                        onBack={() => console.log('Back to current node')}
                        onNo={() => console.log('No')}
                        onYes={() => console.log('Yes')}
                    />
                    <br />
                    <NodeDetails
                        question="Are the spots blanchable?"
                        onBack={() => console.log('Back to current node')}
                        onJump={() => console.log('Jump to this node')}
                    />
                </div>
            </div>
        </>
    );
};

export default UserTree;