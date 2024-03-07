import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../styles/AdminEditTrees.css";

const RootNodeSection = () => {
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);

  const handleDropdownClick = () => {
    setShowAdditionalInputs(!showAdditionalInputs);
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
          <FontAwesomeIcon icon={faAngleDown} />
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
            />
            <button className="yes-node-button">Add Yes Node</button>
          </div>

          <input
            className="white-bar-input-dropdown-additional"
            type="text"
            placeholder="Enter No Node Question"
          />
          <button className="no-node-button">Add No Node</button>
        </div>
      )}
    </div>
  );
};

export default RootNodeSection;
