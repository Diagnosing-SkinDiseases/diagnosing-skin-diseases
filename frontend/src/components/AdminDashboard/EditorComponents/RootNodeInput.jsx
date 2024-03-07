import {
  faAngleDown,
  faAngleUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../styles/AdminEditTrees.css";

const RootNodeSection = () => {
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [yesNodeQuestion, setYesNodeQuestion] = useState("");
  const [noNodeQuestion, setNoNodeQuestion] = useState("");
  const [rootNodeAdded, setRootNodeAdded] = useState(false);
  const [yesNodeAdded, setYesNodeAdded] = useState(false);
  const [noNodeAdded, setNoNodeAdded] = useState(false);

  const handleDropdownClick = () => {
    setShowAdditionalInputs(!showAdditionalInputs);
  };

  const handleAddRootNode = () => {
    setRootNodeAdded(true);
  };

  const handleAddYesNode = () => {
    if (!rootNodeAdded) {
      alert("Please add a root node first.");
      return;
    }
    const inputVal = document.getElementById("yes-node-input").value;
    setYesNodeQuestion(inputVal);
    setYesNodeAdded(true);
  };

  const handleRemoveYesNode = () => {
    setYesNodeQuestion("");
    setYesNodeAdded(false);
  };

  const handleAddNoNode = () => {
    if (!rootNodeAdded) {
      alert("Please add a root node first.");
      return;
    }
    const inputVal = document.getElementById("no-node-input").value;
    setNoNodeQuestion(inputVal);
    setNoNodeAdded(true);
  };

  const handleRemoveNoNode = () => {
    setNoNodeQuestion("");
    setNoNodeAdded(false);
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
            {yesNodeAdded ? (
              <button
                className="remove-node-button"
                onClick={handleRemoveYesNode}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            ) : (
              <button className="yes-node-button" onClick={handleAddYesNode}>
                Add Yes Node
              </button>
            )}
          </div>

          <div className="additional-input-with-button">
            {" "}
            <input
              className="white-bar-input-dropdown-additional"
              type="text"
              placeholder="Enter No Node Question"
              id="no-node-input"
            />
            {noNodeAdded ? (
              <button
                className="remove-node-button"
                onClick={handleRemoveNoNode}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            ) : (
              <button className="no-node-button" onClick={handleAddNoNode}>
                Add No Node
              </button>
            )}
          </div>
        </div>
      )}

      <div className="yes-node-section">
        {yesNodeAdded && (
          <div>
            <h3>Yes Node</h3>
            <div className="white-bar-input-dropdown-container">
              <input
                className="white-bar-input-dropdown"
                type="text"
                placeholder="Enter Yes Node question"
                value={yesNodeQuestion}
                readOnly
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
                  <button
                    className="yes-node-button"
                    onClick={handleAddYesNode}
                  >
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
          </div>
        )}
      </div>

      <div className="no-node-section">
        {noNodeAdded && (
          <div>
            <h3>No Node</h3>
            <div className="white-bar-input-dropdown-container">
              <input
                className="white-bar-input-dropdown"
                type="text"
                placeholder="Enter No Node question"
                value={noNodeQuestion}
                readOnly
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
                  <button
                    className="yes-node-button"
                    onClick={handleAddYesNode}
                  >
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
          </div>
        )}
      </div>
    </div>
  );
};

export default RootNodeSection;
