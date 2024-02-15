import React, { useEffect } from 'react';
import NodeComponent from './NodeComponent';
import NodeDetails from './NodeDetails';
import './UserTree.css';

const drawArrow = (start, end) => {
    requestAnimationFrame(() => {
        if (window.LeaderLine && document.getElementById(start) && document.getElementById(end)) {
            // Create a line using point anchors to connect the center of each element
            const line = new window.LeaderLine(
                document.getElementById(start),
                document.getElementById(end),
                {
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
    useEffect(() => {
        let line;

        /* LeaderLine source: https://anseki.github.io/leader-line/ */
        drawArrow("node1", "node2");
        drawArrow("node1", "node3");
        drawArrow("node2", "node4");
        drawArrow("node2", "node5");
        drawArrow("node3", "node6");
        drawArrow("node3", "node7");

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
                <div className="user-tree">
                    <div id="first-row"><NodeComponent color="#1E90FF" id="node1" /></div>
                    <div id="second-row">
                        <NodeComponent color="#1E90FF" id="node2" class="second-row-nodes" />
                        <NodeComponent color="#1E90FF" id="node3" class="second-row-nodes" />
                    </div>
                    <div id="third-row">
                        <NodeComponent color="#FFD700" id="node4" class="second-row-nodes" />
                        <NodeComponent color="#FFD700" id="node5" class="second-row-nodes" />
                        <NodeComponent color="#FFD700" id="node6" class="second-row-nodes" />
                        <NodeComponent color="#6ad669" id="node7" class="second-row-nodes" />
                    </div>

                </div>
                <br />

                <NodeDetails
                    question="Are the spots blanchable?"
                    onBack={() => console.log('Back to current node')}
                    onJump={() => console.log('Jump to this node')}
                />
                <br />

            </div>

        </>
    );
};

export default UserTree;