import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../styles/AdminEditTrees.css";

const RootNodeSection = () => {
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [yesNodeQuestion, setYesNodeQuestion] = useState(""); // State for Yes Node question
  const [noNodeQuestion, setNoNodeQuestion] = useState(""); // State for No Node question
  const [rootNodeAdded, setRootNodeAdded] = useState(false); // State for tracking if root node is added

  const handleDropdownClick = () => {
    setShowAdditionalInputs(!showAdditionalInputs);
  };

  const handleAddRootNode = () => {
    // You can add validation here if needed
    setRootNodeAdded(true);
  };

  const handleAddYesNode = () => {
    // Check if root node is added before allowing to add Yes Node
    if (!rootNodeAdded) {
      alert("Please add a root node first.");
      return;
    }
    // Set the Yes Node question to the input value
    const inputVal = document.getElementById("yes-node-input").value;
    setYesNodeQuestion(inputVal);
  };

  const handleAddNoNode = () => {
    // Check if root node is added before allowing to add No Node
    if (!rootNodeAdded) {
      alert("Please add a root node first.");
      return;
    }
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
          onChange={handleAddRootNode}
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
              id="yes-node-input"
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
              id="no-node-input"
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
            yesNodeQuestion ? yesNodeQuestion : "Empty Yes Node List"
          }
        />
      </div>
      <div className="no-node-section">
        <h3>No Node</h3>
        <input
          className="white-bar-input"
          type="text"
          placeholder={noNodeQuestion ? noNodeQuestion : "Empty No Node List"}
        />
      </div>
    </div>
  );
};

export default RootNodeSection;
