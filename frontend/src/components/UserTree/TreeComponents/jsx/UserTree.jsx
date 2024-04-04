/**
 * Main component for the user tree to render the tree structure.
 */
import React, { useEffect, useState, useRef } from 'react';
import { NodeComponent, InvisibleNodeComponent } from './NodeComponent';
import '../../../CSS/Tree/UserTree.css';
import CurrentNodeDetails from './CurrentNodeDetails';
import SymbolIndication from './SymbolIndication';
import ZoomControls from './ZoomControls';

// Global variable to store the leader lines
let arrows = [];

// Source from: https://github.com/anseki/leader-line
/**
 * Draw an arrow between two nodes using LeaderLine library.
 * @param {string} start - The ID of the starting node.
 * @param {string} end - The ID of the ending node.
 * @param {string} color - The color of the arrow (e.g., 'red', '#ff0000', 'rgb(255, 0, 0)').
 * @param {number} size - The size of the arrow.
 * @returns {LeaderLine|null} The LeaderLine instance representing the arrow, or null if LeaderLine is not available or the nodes are not found.
 */
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

/**
 * Parses the content of a question, transforming any embedded links into clickable HTML anchor tags
 * while preserving the original link text. This ensures that links in the question content open in a new tab
 * with secure rel attributes.
 *
 * @param {string} content - The content of the question to be parsed.
 * @returns {string} The parsed content with anchor tags modified for safe external navigation and original link text preserved.
 */
const parseQuestionContent = (content) => {
    console.log("parsing question content", content);
    const parsedContent = content.replace(
        /<a href="(.*?)"(.*?)>(.*?)<\/a>/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">$3</a>'
    );
    console.log("question content parsed", parsedContent);
    return parsedContent;
};

/**
 * UserTree component for displaying a tree structure with interactive nodes.
 * @param {Object} props.treeData - The data representing the tree structure.
 * @returns {JSX.Element} JSX element representing the UserTree component.
 */
const UserTree = ({ treeData }) => { // Destructure treeData from props
    const [zoomLevel, setZoomLevel] = useState(1); // Set the initial zoom level
    const treeName = treeData.name; // Set the tree name
    const rootQuestion = treeData.nodes[0].content; // Set the root question
    const zoomRef = useRef(zoomLevel); // Ref to track the zoom level for event listeners
    const treeContainerRef = useRef(null); // Ref to track the tree container for event listeners

    const greenArrow = "#3fc005"; // Set the green arrow color for yes branch
    const redArrow = "#f44336"; // Set the red arrow color for no branch
    const blueNode = "#1E90FF"; // Set the blue node color for question nodes
    const yellowNode = "#FFD700"; // Set the yellow node color for result nodes
    const greenNode = "#6ad669"; // Set the green node color for current node

    const currentNodeIdRef = useRef(null); // Ref to track the current node ID
    const [nodeRows, setNodeRows] = useState([]); // State to store the node rows
    const [nodeColors, setNodeColors] = useState({}); // State to store the node colors
    const [currentNodeId, setCurrentNodeId] = useState(treeData.nodes[0].currentId); // State to store the current node
    const [previousNodeId, setPreviousNodeId] = useState(null); // State to store the previous node
    const [currentNodeContent, setCurrentNodeContent] = useState(rootQuestion); // State to store the current node content

    const zoomIn = (factor = 1.1) => setZoomLevel(zoomLevel => zoomLevel * factor); // Function to zoom in
    const zoomOut = (factor = 1.1) => setZoomLevel(zoomLevel => zoomLevel / factor); // Function to zoom out

    /**
     * useEffect hook to update the zoom level reference when the zoom level changes.
     * @param {number} zoomLevel - The current zoom level.
     */
    useEffect(() => {
        zoomRef.current = zoomLevel; // Update the current zoom level in the ref
    }, [zoomLevel]);

    /**
     * useEffect hook to attach a 'wheel' event listener to the tree container.
     */
    useEffect(() => {
        const treeContainer = treeContainerRef.current;
        if (treeContainer) {
            treeContainer.addEventListener('wheel', handleWheel, { passive: false });

            // Cleanup function to remove the event listener when component unmounts
            return () => {
                treeContainer.removeEventListener('wheel', handleWheel);
            };
        }
    }, []); // Attach wheel event listener to tree container

    /**
     * useEffect hook to update the visual state of the currently selected node in the DOM.
     * This hook is triggered when the `currentNodeId` changes. It locates the DOM element corresponding
     * to the new `currentNodeId` and applies visual styling to indicate that it is the current node.
     *
     * @param {string} currentNodeId - The identifier for the current node in the tree. 
     */
    useEffect(() => {
        if (currentNodeId) {
            const newCurrentNode = document.getElementById(currentNodeId);
            if (newCurrentNode) {
                newCurrentNode.classList.add('currentNode');
                newCurrentNode.style.backgroundColor = greenNode;
            }
        }
    }, [currentNodeId]); // Add currentNodeId to useEffect dependency array

    /**
     * useEffect hook to process tree data.
     * This hook is responsible for initializing and updating the visual representation of a tree structure.
     * It checks for valid tree data, computes the maximum level of the tree, places nodes by their level,
     * colors nodes, and draws arrows between nodes after the component mounts or when the tree data changes.
     *
     * @param {Object} treeData - The data representing the tree structure, including nodes and their connections.
     */
    useEffect(() => {
        if (!treeData || !treeData.nodes || treeData.nodes.length === 0) {
            console.error('Invalid tree data:', treeData);
            return;
        }

        const maxLevel = findMaxLevel(treeData.nodes);
        const nodesByLevel = placeNodesByLevel(treeData.nodes, maxLevel);

        setNodeRows(nodesByLevel);

        setTimeout(() => colorNodes(treeData.nodes), 5);

        setTimeout(() => drawAllArrows(treeData.nodes), 0);

    }, [treeData]); // Add treeData to useEffect dependency array

    /**
     * useEffect hook to initialize or update the colors of the nodes in the tree.
     * Nodes with children are assigned a blue color, while nodes without children are assigned a yellow color.
     *
     * @param {Object} treeData - The data representing the tree structure. It contains nodes with properties like
     *                            `currentId` and `hasChildren` which are used to determine the color of each node.
     */
    useEffect(() => {
        // Initialize or update node colors based on tree data
        const initialColors = {};
        treeData.nodes.forEach(node => {
            initialColors[node.currentId] = node.hasChildren ? blueNode : yellowNode; // Example logic for color assignment
        });
        setNodeColors(initialColors);
    }, [treeData]); // The effect depends on `treeData` and runs when it changes

    /**
     * useEffect hook to manage the color changes of nodes to visually represent the current and previous nodes.
     *
     * @param {string} currentNodeId - The ID of the current node. This node will be highlighted with a green color and pattern inside.
     * @param {string} previousNodeId - The ID of the previous node. This node will be reset to its original color.
     */
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
    }, [currentNodeId, previousNodeId]); // The effect depends on `currentNodeId` and `previousNodeId`

    /**
     * useEffect hook to update the `previousNodeId` state whenever `currentNodeId` changes.
     *
     * @param {string|null} currentNodeId - The ID of the current node, used to track the active node.
     *                                      The hook updates `previousNodeId` based on this value.
     */
    useEffect(() => {
        // Skip on initial render when currentNodeId is null
        if (currentNodeId !== null) {
            // Update previousNodeId to the last currentNodeId
            setPreviousNodeId(currentNodeId);
        }
    }, [currentNodeId]);

    /**
     * useEffect hook to set the content of the current node to the root question when no current node ID is present.
     *
     * @param {string|null} currentNodeId - The ID of the current node. Used to determine if a node is selected.
     * @param {string} rootQuestion - The initial question or content to display at the root of the tree structure.
     */
    useEffect(() => {
        if (!currentNodeId) {
            setCurrentNodeContent(rootQuestion);
        }
    }, [currentNodeId, rootQuestion]);

    /**
     * useEffect hook to redraw arrows in the tree visualization.
     * This hook is triggered when `zoomLevel`, `nodeRows`, or `treeData.nodes` change. 
     *
     * @param {number} zoomLevel - The current zoom level of the tree visualization, used to adjust the drawing of arrows.
     * @param {Array} nodeRows - An array representing the rows of nodes in the tree, used to determine how arrows should be drawn.
     * @param {Array} treeData.nodes - An array of node objects from the tree data, used to calculate the connections that need to be drawn.
    */
    useEffect(() => {
        // Remove existing arrows before redrawing them
        arrows.forEach(arrow => arrow.remove());
        arrows = [];

        if (nodeRows.length > 0) {
            setTimeout(() => drawAllArrows(treeData.nodes, zoomLevel), 0);
        }
    }, [zoomLevel, nodeRows, treeData.nodes]);

    /**
     * useEffect hook to manage arrow redrawing on the tree container's scroll events.
     *
     * @param {Array} treeData.nodes - An array of node objects from the tree data, used in arrow drawing calculations.
     * @param {number} zoomLevel - The current zoom level of the tree visualization, affecting how arrows are drawn.
     */
    useEffect(() => {
        // Function to redraw arrows
        const redrawArrows = () => {
            arrows.forEach(arrow => arrow.remove());
            arrows = [];
            drawAllArrows(treeData.nodes, zoomLevel);
        };

        const userTreeContainer = document.querySelector('.user-tree-container');
        userTreeContainer.addEventListener('scroll', redrawArrows);

        return () => userTreeContainer.removeEventListener('scroll', redrawArrows);
    }, [treeData.nodes, zoomLevel]);

    /**
     * useEffect hook to attach a 'wheel' event listener to the tree container for handling scrolling.
     *
     * @param {Object} treeContainerRef - A ref object pointing to the tree container DOM element, used to attach the event listener.
     */
    useEffect(() => {
        const treeContainer = treeContainerRef.current;
        if (treeContainer) {
            treeContainer.addEventListener('wheel', handleWheel, { passive: false });

            // Cleanup function to remove arrows and event listener
            return () => {
                treeContainer.removeEventListener('wheel', handleWheel);
                // Remove all arrows
                arrows.forEach(arrow => arrow.remove());
                arrows = [];
            };
        }
    }, []); // Attach wheel event listener to tree container


    /**
     * useEffect hook to synchronize the `currentNodeId` with a ref and trigger a color update on nodes.
     *
     * @param {string} currentNodeId - The ID of the current node, which drives updates to the node coloring and is tracked by the ref.
     */
    useEffect(() => {
        currentNodeIdRef.current = currentNodeId;
        colorNodes();
    }, [currentNodeId]);

    /**
     * useEffect hook to update the `currentNodeContent` state when the `currentNodeId` changes.
     * 
     * @param {string} currentNodeId - The ID of the current node.
     * @param {Object} treeData - The data representing the tree structure, containing an array of node objects.
     */
    useEffect(() => {
        const currentNode = treeData.nodes.find(n => n.currentId === currentNodeId);
        if (currentNode) {
            const parsedContent = parseQuestionContent(currentNode.content);
            setCurrentNodeContent(parsedContent);
            console.log("current node content change to:", parsedContent);
        }
    }, [currentNodeId, treeData.nodes]);


    /**
     * Handles the wheel event for a tree container to implement custom zoom behavior.
     *
     * @param {WheelEvent} event - The wheel event triggered when the user scrolls over the tree container.
     */
    const handleWheel = (event) => {
        event.preventDefault(); // Prevent the default scroll behavior
        const { deltaY } = event; // Get scroll direction
        const rect = treeContainerRef.current.getBoundingClientRect(); // Get the bounding rectangle of the zoomed element
        const x = (event.clientX - rect.left) / zoomLevel; // Calculate x position relative to zoomed element
        const y = (event.clientY - rect.top) / zoomLevel; // Calculate y position relative to zoomed element

        // Update transform origin for zooming in/out at mouse position
        event.currentTarget.style.transformOrigin = `${x}px ${y}px`;

        // Zoom in or out based on scroll direction
        if (deltaY < 0) {
            zoomIn();
        } else if (deltaY > 0) {
            zoomOut();
        }

        // Apply the transform origin for scaling at the mouse position to the zoomed element
        const userTreeElement = treeContainerRef.current.querySelector('.user-tree');
        if (userTreeElement) {
            userTreeElement.style.transformOrigin = `${x}px ${y}px`;
        }
    };

    /**
     * Handles click events on nodes within the tree.
     * This function updates the visual and data state to reflect the newly selected node.
     *
     * @param {string} nodeId - The ID of the clicked node, used to identify and update the corresponding node.
     */
    const handleNodeClick = nodeId => {
        // Find and clear the previous current node
        const prevCurrentNode = document.querySelector('.currentNode');
        if (prevCurrentNode && prevCurrentNode.id !== nodeId) {
            prevCurrentNode.classList.remove('currentNode');
            // Reset the color based on node's original state
            const originalColor = nodeColors[prevCurrentNode.id]; // Assuming nodeColors is defined and populated
            prevCurrentNode.style.backgroundColor = originalColor;
        }

        // Update the current node state and content
        const node = treeData.nodes.find(n => n.currentId === nodeId);
        setCurrentNodeId(nodeId);
        setCurrentNodeContent(node ? node.content : rootQuestion);

        // Highlight the new current node
        const newCurrentNode = document.getElementById(nodeId);
        if (newCurrentNode) {
            newCurrentNode.classList.add('currentNode');
            newCurrentNode.style.backgroundColor = greenNode;
        }
    };

    /**
     * Handles hover events on nodes within the tree, updating the content displayed based on the node hovered over.
     *
     * @param {string} nodeId - The ID of the node being hovered over, used to find the corresponding node data and update the content display.
     */
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
                const currentNode = currentId ? treeData.nodes.find(n => n.currentId === currentId) : null;
                setCurrentNodeContent(currentNode ? currentNode.content : rootQuestion);
            };
        }
    };

    /**
     * Draws arrows between nodes in the tree visualization, scaling the arrow size based on the zoom level.
     * This function first clears any existing arrows, then iterates through the nodes to draw new arrows
     * based on their child relationships. Arrows are drawn in different colors (red for 'no' children,
     * green for 'yes' children) and are scaled according to the current zoom level.
     *
     * @param {Array} nodes - An array of node objects, each containing information like `currentId`,
     *                        `noChildId`, and `yesChildId` to determine where to draw the arrows.
     * @param {number} [zoomLevel=1] - The current zoom level of the visualization, used to scale the arrow size.
     */
    const drawAllArrows = (nodes, zoomLevel = 1) => {
        arrows.forEach(arrow => arrow.remove());
        arrows = [];

        const baseSize = 3.8; // Base size of the arrow
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

    /**
     * Calculates the maximum level (depth) in a tree structure given its nodes.
     *
     * @param {Array} nodes - An array of node objects that form the tree structure. 
     * @returns {number} The maximum level (depth) found in the tree structure.
     */
    const findMaxLevel = nodes => {
        let maxLevel = 0;
        // Recursively find the maximum level in the tree
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


    /**
     * Organizes and renders nodes by their level in the tree, up to the specified maximum level.
     *
     * @param {Array} nodes - An array of node objects that form the tree structure. Each node object
     *                        has properties like `currentId`, `yesChildId`, and `noChildId`.
     * @param {number} maxLevel - The maximum level to which the tree should be rendered.
     * @returns {Array} A React element array representing the placed nodes in the tree structure, 
     *                  starting from the root node down to the specified maximum level.
     */
    const placeNodesByLevel = (nodes, maxLevel) => {
        if (!nodes || nodes.length === 0) return [];

        // Helper function to recursively place nodes by level
        const placeNode = (nodeId, level, maxLevel) => {
            if (level > maxLevel) return null;

            // Find the node with the specified ID
            const node = nodeId ? nodes.find(n => n.currentId === nodeId) : null;

            let nodeElement, children;
            if (node) {
                // Generate a unique key for visible nodes with the current ID
                nodeElement = <NodeComponent id={node.currentId} color={blueNode} key={node.currentId} onClick={() => handleNodeClick(node.currentId)} onMouseEnter={() => handleNodeHover(node.currentId)} />;
                children = [];

                const yesChildId = node.yesChildId;
                const noChildId = node.noChildId;

                if (noChildId) {
                    children.push(placeNode(noChildId, level + 1, maxLevel));
                }

                if (yesChildId) {
                    children.push(placeNode(yesChildId, level + 1, maxLevel));
                }
            } else {
                // Generate a unique key for invisible nodes to take up space
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

    /**
     * Updates the colors of all nodes in the tree to reflect their current state.
     * The current node is highlighted in green, nodes with children are colored blue, 
     * and nodes without children are colored yellow.
     */
    const colorNodes = () => {
        // Remove 'currentNode' class from all nodes
        document.querySelectorAll('.node-component').forEach(element => {
            element.classList.remove('currentNode');
            element.style.backgroundColor = element.id === currentNodeId ? greenNode : blueNode;
        });

        // Find the current node and add 'currentNode' class
        const currentNodeElement = document.getElementById(currentNodeId);
        if (currentNodeElement) {
            currentNodeElement.classList.add('currentNode');
            currentNodeElement.style.backgroundColor = greenNode; // Apply the green color and inside pattern for the current node
        }

        // Set colors for all nodes based on their state
        treeData.nodes.forEach(node => {
            const element = document.getElementById(node.currentId);
            if (element) {
                const nodeColor = node.currentId === currentNodeId ? greenNode : (node.yesChildId || node.noChildId ? blueNode : yellowNode);
                element.style.backgroundColor = nodeColor;
            }
        });
    };

    /**
     * Handles the "yes" action for the current node in the tree structure.
     * This function updates the current node to the 'yes' child of the current node, if it exists.
     */
    const handleYes = () => {
        const currentNode = treeData.nodes.find(n => n.currentId === currentNodeId);
        if (currentNode && currentNode.yesChildId) {
            setCurrentNodeId(currentNode.yesChildId);
            const childNode = treeData.nodes.find(n => n.currentId === currentNode.yesChildId);
            setCurrentNodeContent(childNode ? childNode.content : '');
        } else if (!currentNodeId && treeData.nodes.length > 0) {
            setCurrentNodeId(treeData.nodes[0].yesChildId);
        }
        colorNodes();
    };

    /**
     * Handles the "no" action for the current node in the tree structure.
     * This function updates the current node to the 'no' child of the current node, if it exists.
     */
    const handleNo = () => {
        const currentNode = treeData.nodes.find(n => n.currentId === currentNodeId);
        if (currentNode && currentNode.noChildId) {
            setCurrentNodeId(currentNode.noChildId);
            const childNode = treeData.nodes.find(n => n.currentId === currentNode.noChildId);
            setCurrentNodeContent(childNode ? childNode.content : '');
        } else if (!currentNodeId && treeData.nodes.length > 0) {
            setCurrentNodeId(treeData.nodes[0].noChildId);
        }
        colorNodes();
    };

    /**
     * Handles the "back" action for the current node in the tree structure.
     * This function updates the current node to the parent node of the current node, if it exists.
     */
    const handleBack = () => {
        const currentNode = treeData.nodes.find(n => n.currentId === currentNodeId);
        if (currentNode && currentNode.parentId) {
            setCurrentNodeId(currentNode.parentId);
            const parentNode = treeData.nodes.find(n => n.currentId === currentNode.parentId);
            setCurrentNodeContent(parentNode ? parentNode.content : rootQuestion);
        } else {
            setCurrentNodeId(null);
            setCurrentNodeContent(rootQuestion);
        }
        colorNodes();
    };

    return (
        <>
            <div id="user-tree-page">
                <h1 id="tree-name" className={zoomLevel > 1 ? 'hide-title' : ''}>{treeName}</h1>
                <ZoomControls onZoomIn={() => zoomIn()} onZoomOut={() => zoomOut()} />
                <div className="user-tree-container" ref={treeContainerRef}>
                    <SymbolIndication />
                    <div className="user-tree" style={{ transform: `scale(${zoomLevel})` }}>
                        {nodeRows.map((nodeRow, index) => (
                            <div key={`node-row-${index}`} className={`node-row level-${index}`}>
                                {nodeRow}
                            </div>
                        ))}
                    </div>
                    <CurrentNodeDetails
                        onBack={handleBack}
                        onNo={handleNo}
                        onYes={handleYes}
                        showBack={currentNodeId && currentNodeId !== treeData.nodes[0].currentId} // Show back button if not at root
                        showYes={!!(treeData.nodes.find(n => n.currentId === currentNodeId)?.yesChildId)} // Show "Yes" if there is a yesChildId
                        showNo={!!(treeData.nodes.find(n => n.currentId === currentNodeId)?.noChildId)} // Show "No" if there is a noChildId
                        question={<div dangerouslySetInnerHTML={{ __html: currentNodeContent }} />} // Display the current node's content, display root question if not set
                    />
                </div>
            </div>
        </>
    );
};

export default UserTree;
