import React from 'react';
import './NodeDetails.css';

/* Node detailes when click/hover over a node */
const NodeDetails = ({ question, onBack, onJump }) => {
    return (
        <div className="node-details">
            <div className="question">
                {question}
            </div>
            <div className="buttons">
                <button onClick={onBack} className="btn btn-primary btn-back-to-current-node">Back To Current Node</button>
                <button onClick={onJump} className="btn btn-primary btn-jump-to-this-node">Jump To This Node</button>
            </div>
        </div>
    );
}

export default NodeDetails;
