import React from 'react';
import './CurrentNodeDetails.css';

/* Node detailes when click/hover over a node */
const CurrentNodeDetails = ({ question, onBack, onNo, onYes }) => {
    return (
        <div className="current-node-details">
            <div className="question">
                {question}
            </div>
            <div className="buttons">
                <button onClick={onBack} className="btn btn-primary btn-back">Back</button>
                <button onClick={onNo} className="btn btn-danger btn-no">No</button>
                <button onClick={onYes} className="btn btn-success btn-yes">Yes</button>
            </div>
        </div>
    );
}

export default CurrentNodeDetails;
