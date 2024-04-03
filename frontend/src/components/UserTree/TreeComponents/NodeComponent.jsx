import React from 'react';
import './NodeComponent.css';

/**
 * Represents a visible node in the tree structure.
 *
 * @param {Object} props - The props for the NodeComponent.
 * @param {string} props.color - The background color of the node.
 * @param {string} props.id - The identifier for the node, used for event handling and as the DOM element's id.
 * @param {Function} props.onClick - Callback function to be executed when the node is clicked.
 * @param {Function} props.onMouseEnter - Callback function to be executed when the mouse enters the node area.
 * @returns {React.ReactElement} A styled div representing the node with the specified color and event handlers.
 */
const NodeComponent = ({ color, id, onClick, onMouseEnter }) => {
    return (
        <div className="node-component" id={id} style={{ backgroundColor: color }} onClick={() => onClick(id)} onMouseEnter={() => onMouseEnter(id)}>
        </div>
    );
};

/**
 * Represents an invisible node in the tree structure.
 *
 * @returns {React.ReactElement} A styled div representing an invisible node, used for spacing or structural purposes.
 */
const InvisibleNodeComponent = () => {
    return (
        <div className="invisible-node-component" style={{ backgroundColor: "transparent" }}>
        </div>
    );
};

export { NodeComponent, InvisibleNodeComponent };
