import React from 'react';
import './CurrentNodeDetails.css';

/* Current node details when click/hover over a node */
const CurrentNodeDetails = ({ question, onBack, onNo, onYes, showBack, showNo, showYes }) => {
    return (
        <div className="current-node-details">
            <div className="buttons">
                {showBack && <button onClick={onBack} className="btn btn-primary btn-back">Back</button>}
                {showNo && <button onClick={onNo} className="btn btn-danger btn-no">No</button>}
                {showYes && <button onClick={onYes} className="btn btn-success btn-yes">Yes</button>}
            </div>
            <div className="question">
                {question}
            </div>
        </div>
    );
}

export default CurrentNodeDetails;
