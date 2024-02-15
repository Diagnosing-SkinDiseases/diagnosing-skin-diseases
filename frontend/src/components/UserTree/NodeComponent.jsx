import React from 'react';
import './NodeComponent.css';


/* TODO: Input id and color for node to be rendered */
/* TODO: Use js to change color of node if node is current node or being viewed information*/
const NodeComponent = ({ color, id }) => {
    return (
        <div className="node-component" id={id} style={{ backgroundColor: color }}>
            {/* You can display the id or any other content here */}
        </div>
    );
}

export default NodeComponent;
