import React from 'react';
import './NodeDetails.css';

/**
 * Component for displaying the details of a node and providing navigation options.
 *
 * @param {Object} props - The props for the NodeDetails component.
 * @param {string} props.question - The question or content of the node to be displayed.
 * @param {Function} props.onBack - Callback function to be executed when the 'Back To Current Node' button is clicked.
 * @param {Function} props.onJump - Callback function to be executed when the 'Jump To This Node' button is clicked.
 * @returns {React.ReactElement} The NodeDetails component with question details and navigation buttons.
 */
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

