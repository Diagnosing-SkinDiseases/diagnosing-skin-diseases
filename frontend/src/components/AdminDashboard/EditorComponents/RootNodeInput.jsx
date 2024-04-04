import {
  faAngleDown,
  faAngleUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../../CSS/Admin/AdminEditTrees.css";

const RootNodeSection = () => {
  const [showAdditionalInputsRoot, setShowAdditionalInputsRoot] =
    useState(false);
  const [showAdditionalInputsYes, setShowAdditionalInputsYes] = useState(false);
  const [showAdditionalInputsNo, setShowAdditionalInputsNo] = useState(false);
  const [yesNodeQuestion, setYesNodeQuestion] = useState("");
  const [noNodeQuestion, setNoNodeQuestion] = useState("");
  const [rootNodeAdded, setRootNodeAdded] = useState(false);
  const [yesNodeAdded, setYesNodeAdded] = useState(false);
  const [noNodeAdded, setNoNodeAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDropdownClickRoot = () => {
    setShowAdditionalInputsRoot(!showAdditionalInputsRoot);
  };

  const handleDropdownClickYes = () => {
    setShowAdditionalInputsYes(!showAdditionalInputsYes);
  };

  const handleDropdownClickNo = () => {
    setShowAdditionalInputsNo(!showAdditionalInputsNo);
  };

  const handleAddRootNode = () => {
    setRootNodeAdded(true);
    setErrorMessage("");
  };

  const handleAddYesNode = () => {
    if (!rootNodeAdded) {
      setErrorMessage("Please add a root node first.");
      return;
    }
    const inputVal = document.getElementById("yes-node-input").value;
    if (inputVal.trim() === "") {
      setErrorMessage("Please enter a question for the Yes Node.");
      return;
    }
    setYesNodeQuestion(inputVal);
    setYesNodeAdded(true);
    setErrorMessage("");
  };

  const handleRemoveYesNode = () => {
    setYesNodeQuestion("");
    setYesNodeAdded(false);
  };

  const handleAddNoNode = () => {
    if (!rootNodeAdded) {
      setErrorMessage("Please add a root node first.");
      return;
    }
    const inputVal = document.getElementById("no-node-input").value;
    if (inputVal.trim() === "") {
      setErrorMessage("Please enter a question for the No Node.");
      return;
    }
    setNoNodeQuestion(inputVal);
    setNoNodeAdded(true);
    setErrorMessage("");
  };

  const handleRemoveNoNode = () => {
    setNoNodeQuestion("");
    setNoNodeAdded(false);
  };

  return (
    <div className="root-node-section-container">
      <h3>Root Node</h3>
      <h3 style={{ color: "red" }}>{errorMessage}</h3>
      <div className="white-bar-input-dropdown-container">
        <input
          className="white-bar-input-dropdown"
          type="text"
          placeholder="Enter Root Node question"
          onChange={handleAddRootNode}
        />
        <button className="dropdown-button" onClick={handleDropdownClickRoot}>
          <FontAwesomeIcon
            icon={showAdditionalInputsRoot ? faAngleUp : faAngleDown}
          />
        </button>
      </div>
      {showAdditionalInputsRoot && (
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
              <button
                className="dropdown-button"
                onClick={handleDropdownClickYes}
              >
                <FontAwesomeIcon
                  icon={showAdditionalInputsYes ? faAngleUp : faAngleDown}
                />
              </button>
            </div>
            {showAdditionalInputsYes && (
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
              <button
                className="dropdown-button"
                onClick={handleDropdownClickNo}
              >
                <FontAwesomeIcon
                  icon={showAdditionalInputsNo ? faAngleUp : faAngleDown}
                />
              </button>
            </div>
            {showAdditionalInputsNo && (
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
