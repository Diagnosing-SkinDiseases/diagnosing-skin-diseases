import React from "react";

const SelectedLetterDisplay = ({ selectedLetter }) => {
  return (
    <div className="selected-letter-container">
      {selectedLetter && (
        <div className="selected-letter-display">
          <p>{selectedLetter}</p>
        </div>
      )}
    </div>
  );
};

export default SelectedLetterDisplay;
