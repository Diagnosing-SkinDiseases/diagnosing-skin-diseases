import React from 'react';
import './NodeComponent.css';


/* TODO: Input id and color for node to be rendered */
/* TODO: Use js to change color of node if node is current node or being viewed information*/
const NodeComponent = ({ color, id, onClick }) => {
    return (
        <div className="node-component" id={id} style={{ backgroundColor: color }} onClick={() => onClick(id)}>
        </div>
    );
};


const InvisibleNodeComponent = () => {
    return (
        <div className="invisible-node-component" style={{ backgroundColor: "blue" }} >
        </div >
    );
};

export { NodeComponent, InvisibleNodeComponent };
