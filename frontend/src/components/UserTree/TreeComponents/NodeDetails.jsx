import React from 'react';
import './NodeDetails.css';

/* Node details when click/hover over a node */
const NodeDetails = ({ question, onBack, onJump }) => {
    return (
        <div className="node-details">
            <div className="buttons">
                <button onClick={onBack} className="btn btn-primary btn-back-to-current-node">Back To Current Node</button>
                <button onClick={onJump} className="btn btn-primary btn-jump-to-this-node">Jump To This Node</button>
            </div>
            <div className="question">
                {question}
            </div>
        </div>
    );
}

export default NodeDetails;
