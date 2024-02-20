import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const AlphabetButtons = ({ onButtonClick }) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleClick = (letter) => {
    onButtonClick(letter);
  };

  return (
    <div className="alphabet-buttons-container">
      <div className="row">
        {alphabet.map((letter) => (
          <div className="col-1" key={letter}>
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
  );
};

export default AlphabetButtons;
