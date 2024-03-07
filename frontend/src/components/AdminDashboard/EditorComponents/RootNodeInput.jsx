import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../styles/AdminEditTrees.css";

const RootNodeSection = () => {
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [yesNodeQuestion, setYesNodeQuestion] = useState(""); // State for Yes Node question
  const [noNodeQuestion, setNoNodeQuestion] = useState(""); // State for No Node question

  const handleDropdownClick = () => {
    setShowAdditionalInputs(!showAdditionalInputs);
  };

  const handleAddYesNode = () => {
    // Set the Yes Node question to the input value
    const inputVal = document.getElementById("yes-node-input").value;
    setYesNodeQuestion(inputVal);
  };

  const handleAddNoNode = () => {
    // Set the No Node question to the input value
    const inputVal = document.getElementById("no-node-input").value;
    setNoNodeQuestion(inputVal);
  };

  return (
    <div className="root-node-section-container">
      <h3>Root Node</h3>
      <div className="white-bar-input-dropdown-container">
        <input
          className="white-bar-input-dropdown"
          type="text"
          placeholder="Enter Root Node question"
        />
        <button className="dropdown-button" onClick={handleDropdownClick}>
          <FontAwesomeIcon
            icon={showAdditionalInputs ? faAngleUp : faAngleDown}
          />
        </button>
      </div>
      {showAdditionalInputs && (
        <div className="additional-inputs-container">
          <div className="additional-input-with-button">
            {" "}
            <input
              className="white-bar-input-dropdown-additional"
              type="text"
              placeholder="Enter Yes Node Question"
              id="yes-node-input" // Added id to reference the input
            />
            <button className="yes-node-button" onClick={handleAddYesNode}>
              Add Yes Node
            </button>
          </div>

          <div className="additional-input-with-button">
            {" "}
            <input
              className="white-bar-input-dropdown-additional"
              type="text"
              placeholder="Enter No Node Question"
              id="no-node-input" // Added id to reference the input
            />
            <button className="no-node-button" onClick={handleAddNoNode}>
              Add No Node
            </button>
          </div>
        </div>
      )}

      <div className="yes-node-section">
        <h3>Yes Node</h3>
        <input
          className="white-bar-input"
          type="text"
          placeholder={
            yesNodeQuestion ? yesNodeQuestion : "Empty Yes Nodes List"
          }
        />
      </div>
      <div className="no-node-section">
        <h3>No Node</h3>
        <input
          className="white-bar-input"
          type="text"
          placeholder={noNodeQuestion ? noNodeQuestion : "Empty No Nodes List"}
        />
      </div>
    </div>
  );
};

export default RootNodeSection;
