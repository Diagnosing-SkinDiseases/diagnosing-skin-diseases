import React from "react";

const AlphabetButtons = ({ onButtonClick }) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleClick = (letter) => {
    onButtonClick(letter);
  };

  return (
    <div className="alphabet-buttons-container">
      <div className="alphabet-buttons">
        <div className="row">
          {alphabet.map((letter) => (
            <div className="col" key={letter}>
              <button
                className="alphabet-button"
                onClick={() => handleClick(letter)}
              >
                {letter}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlphabetButtons;
