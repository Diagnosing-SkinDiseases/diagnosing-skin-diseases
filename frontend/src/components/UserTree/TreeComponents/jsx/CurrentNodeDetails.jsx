import React from 'react';
import "../../../CSS/Tree/CurrentNodeDetails.css";

/**
 * Component for displaying the details of the current node in the tree, along with navigation buttons.
 *
 * @param {Object} props - The props for the CurrentNodeDetails component.
 * @param {string} props.question - The content or question of the current node to be displayed.
 * @param {Function} props.onBack - Callback function executed when the 'Back' button is clicked.
 * @param {Function} props.onNo - Callback function executed when the 'No' button is clicked.
 * @param {Function} props.onYes - Callback function executed when the 'Yes' button is clicked.
 * @param {boolean} props.showBack - Determines if the 'Back' button should be displayed.
 * @param {boolean} props.showNo - Determines if the 'No' button should be displayed.
 * @param {boolean} props.showYes - Determines if the 'Yes' button should be displayed.
 * @returns {React.ReactElement} A component displaying the current node's details and conditional navigation buttons.
 */
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

